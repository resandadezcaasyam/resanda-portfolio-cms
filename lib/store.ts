import "server-only";
import {
  projects as seedProjects,
  experiences as seedExperiences,
  profile as seedProfile,
  type Project,
  type Experience,
  type Profile,
  type Status,
} from "./content";
import { createClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db =
  url && key
    ? createClient(url, key, { auth: { persistSession: false } })
    : null;
type LocalContent = {
  projects: Project[];
  experiences: Experience[];
  profile: Profile;
};
const file = path.join(process.cwd(), "data", "portfolio.json");
let pending: Promise<unknown> = Promise.resolve();
async function local(): Promise<LocalContent> {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    return {
      projects: seedProjects,
      experiences: seedExperiences,
      profile: seedProfile,
    };
  }
}
async function mutate(update: (content: LocalContent) => void) {
  const next = pending.then(async () => {
    const content = await local();
    update(content);
    await mkdir(path.dirname(file), { recursive: true });
    const temp = file + "." + crypto.randomUUID() + ".tmp";
    await writeFile(temp, JSON.stringify(content, null, 2), "utf8");
    await rename(temp, file);
  });
  pending = next.catch(() => {});
  await next;
}
const visible = <T extends { status: Status }>(items: T[], all: boolean) =>
  all ? items : items.filter((item) => item.status === "published");
export async function getProjects(all = false): Promise<Project[]> {
  if (!db) return visible((await local()).projects, all);
  let q = db.from("projects").select("*").order("sort_order");
  if (!all) q = q.eq("status", "published");
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}
export async function getProject(slug: string, all = false) {
  return (await getProjects(all)).find((p) => p.slug === slug);
}
export async function saveProject(v: Project) {
  if (!db) {
    await mutate((c) => {
      const i = c.projects.findIndex((p) => p.id === v.id);
      if (i < 0) c.projects.unshift(v);
      else c.projects[i] = v;
    });
    return v;
  }
  const { data, error } = await db.from("projects").upsert(v).select().single();
  if (error) throw error;
  return data as Project;
}
export async function removeProject(id: string) {
  if (!db) {
    await mutate((c) => {
      c.projects = c.projects.filter((p) => p.id !== id);
    });
    return;
  }
  const { error } = await db.from("projects").delete().eq("id", id);
  if (error) throw error;
}
export async function getExperiences(all = false): Promise<Experience[]> {
  if (!db) return visible((await local()).experiences, all);
  let q = db.from("experiences").select("*").order("sort_order");
  if (!all) q = q.eq("status", "published");
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}
export async function saveExperience(v: Experience) {
  if (!db) {
    await mutate((c) => {
      const i = c.experiences.findIndex((e) => e.id === v.id);
      if (i < 0) c.experiences.unshift(v);
      else c.experiences[i] = v;
    });
    return v;
  }
  const { data, error } = await db
    .from("experiences")
    .upsert(v)
    .select()
    .single();
  if (error) throw error;
  return data as Experience;
}
export async function removeExperience(id: string) {
  if (!db) {
    await mutate((c) => {
      c.experiences = c.experiences.filter((e) => e.id !== id);
    });
    return;
  }
  const { error } = await db.from("experiences").delete().eq("id", id);
  if (error) throw error;
}
export async function getProfile(): Promise<Profile> {
  if (!db) return (await local()).profile;
  const { data, error } = await db
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data || seedProfile;
}
export async function saveProfile(v: Profile) {
  if (!db) {
    await mutate((c) => {
      c.profile = v;
    });
    return v;
  }
  const { data, error } = await db.from("profile").upsert(v).select().single();
  if (error) throw error;
  return data as Profile;
}
