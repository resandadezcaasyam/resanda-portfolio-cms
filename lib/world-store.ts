import "server-only";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { worldDefaults, type WorldConfig } from "./world-config";
const file = path.join(process.cwd(), "data", "world-config.json");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db =
  url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;
export async function getWorldConfig(): Promise<WorldConfig> {
  if (db) {
    const { data, error } = await db
      .from("portfolio_config")
      .select("value")
      .eq("id", "world")
      .maybeSingle();
    if (error)
      throw new Error(
        "Portfolio configuration table unavailable. Apply supabase/world-config.sql.",
      );
    return data?.value || worldDefaults;
  }
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    return worldDefaults;
  }
}
export async function saveWorldConfig(value: WorldConfig) {
  if (db) {
    const { error } = await db
      .from("portfolio_config")
      .upsert({ id: "world", value });
    if (error) throw error;
    return;
  }
  await mkdir(path.dirname(file), { recursive: true });
  const temp = file + "." + crypto.randomUUID() + ".tmp";
  await writeFile(temp, JSON.stringify(value, null, 2), "utf8");
  await rename(temp, file);
}
