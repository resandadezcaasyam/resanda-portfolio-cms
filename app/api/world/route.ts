import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorldConfig, saveWorldConfig } from "@/lib/world-store";
const text = z.string().min(1).max(5000),
  link = z
    .string()
    .max(2000)
    .refine(
      (v) =>
        !v ||
        (v.startsWith("/") && !v.startsWith("//")) ||
        /^https:\/\//.test(v),
      "Use a local path or https URL",
    );
const schema = z.object({
  about: z.array(text).max(10),
  education: text,
  skills: z
    .array(
      z.object({
        id: text,
        name: text,
        description: text,
        tools: z.array(text).max(30),
      }),
    )
    .max(24),
  achievements: z
    .array(
      z.object({
        id: text,
        year: text,
        title: text,
        organization: text,
        rank: text,
        description: text,
      }),
    )
    .max(30),
  leadership: z.array(z.object({ title: text, description: text })).max(20),
  links: z.object({ github: link, resume: link }),
  impact: z.array(z.object({ value: text, label: text })).max(8),
});
export async function GET() {
  return NextResponse.json(await getWorldConfig());
}
export async function PUT(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    await saveWorldConfig(parsed.data);
    return NextResponse.json(parsed.data);
  } catch {
    return NextResponse.json(
      { error: "Unable to save configuration." },
      { status: 500 },
    );
  }
}
