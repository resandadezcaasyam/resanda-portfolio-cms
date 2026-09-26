"use client";
import { useState } from "react";
import Link from "next/link";
import type { WorldConfig } from "@/lib/world-config";
export function ConfigEditor({ initial }: { initial: WorldConfig }) {
  const [value, setValue] = useState(initial),
    [message, setMessage] = useState(""),
    [saving, setSaving] = useState(false);
  const update = <K extends keyof WorldConfig>(key: K, v: WorldConfig[K]) =>
    setValue((old) => ({ ...old, [key]: v }));
  const field = (
    label: string,
    v: string,
    change: (v: string) => void,
    area = false,
  ) => (
    <label>
      {label}
      {area ? (
        <textarea value={v} onChange={(e) => change(e.target.value)} />
      ) : (
        <input value={v} onChange={(e) => change(e.target.value)} />
      )}
    </label>
  );
  return (
    <main className="config-editor" id="main-content">
      <Link href="/admin">← Back to studio</Link>
      <h1>Portfolio content</h1>
      <p>
        Manage the information that powers the public 3D journey. Changes appear
        on the next page load.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const res = await fetch("/api/world", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(value),
            });
            setMessage(
              res.ok
                ? "Saved. Your public portfolio is up to date."
                : "Unable to save. Check that all fields have content and links use https or a local path.",
            );
          } catch {
            setMessage("Connection failed. Your edits are still here.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <fieldset>
          <legend>Introduction & education</legend>
          {field(
            "About paragraphs (one per line)",
            value.about.join("\n"),
            (v) => update("about", v.split("\n")),
            true,
          )}
          {field("Education", value.education, (v) => update("education", v))}
        </fieldset>
        <fieldset>
          <legend>External links</legend>
          {field(
            "GitHub URL (leave blank until available)",
            value.links.github,
            (v) => update("links", { ...value.links, github: v }),
          )}
          {field("Resume URL or local path", value.links.resume, (v) =>
            update("links", { ...value.links, resume: v }),
          )}
          <p>
            Email and LinkedIn are managed in{" "}
            <Link href="/admin/profile">Profile</Link>.
          </p>
        </fieldset>
        <h2>Expertise clusters</h2>
        {value.skills.map((s, i) => (
          <fieldset key={s.id}>
            <legend>Cluster {i + 1}</legend>
            {field("Name", s.name, (v) =>
              update(
                "skills",
                value.skills.map((x, j) => (j === i ? { ...x, name: v } : x)),
              ),
            )}
            {field(
              "Description",
              s.description,
              (v) =>
                update(
                  "skills",
                  value.skills.map((x, j) =>
                    j === i ? { ...x, description: v } : x,
                  ),
                ),
              true,
            )}
            {field("Tools (comma separated)", s.tools.join(", "), (v) =>
              update(
                "skills",
                value.skills.map((x, j) =>
                  j === i
                    ? { ...x, tools: v.split(",").map((t) => t.trim()) }
                    : x,
                ),
              ),
            )}
            <button
              type="button"
              onClick={() =>
                update(
                  "skills",
                  value.skills.filter((_, j) => j !== i),
                )
              }
            >
              Remove cluster
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() =>
            update("skills", [
              ...value.skills,
              {
                id: crypto.randomUUID(),
                name: "New discipline",
                description: "Describe your approach.",
                tools: [],
              },
            ])
          }
        >
          + Add cluster
        </button>
        <h2>Achievements</h2>
        {value.achievements.map((a, i) => (
          <fieldset key={a.id}>
            <legend>Milestone {i + 1}</legend>
            {(
              ["title", "year", "organization", "rank", "description"] as const
            ).map((k) => (
              <div key={k}>
                {field(
                  k[0].toUpperCase() + k.slice(1),
                  a[k],
                  (v) =>
                    update(
                      "achievements",
                      value.achievements.map((x, j) =>
                        j === i ? { ...x, [k]: v } : x,
                      ),
                    ),
                  k === "description",
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                update(
                  "achievements",
                  value.achievements.filter((_, j) => j !== i),
                )
              }
            >
              Remove milestone
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() =>
            update("achievements", [
              ...value.achievements,
              {
                id: crypto.randomUUID(),
                year: "2026",
                title: "New milestone",
                organization: "Organization",
                rank: "Recognition",
                description: "Describe the work.",
              },
            ])
          }
        >
          + Add milestone
        </button>
        <h2>Impact</h2>
        {value.impact.map((a, i) => (
          <fieldset key={i}>
            {field("Value", a.value, (v) =>
              update(
                "impact",
                value.impact.map((x, j) => (j === i ? { ...x, value: v } : x)),
              ),
            )}
            {field("Label", a.label, (v) =>
              update(
                "impact",
                value.impact.map((x, j) => (j === i ? { ...x, label: v } : x)),
              ),
            )}
            <button
              type="button"
              onClick={() =>
                update(
                  "impact",
                  value.impact.filter((_, j) => j !== i),
                )
              }
            >
              Remove result
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() =>
            update("impact", [
              ...value.impact,
              { value: "Result", label: "Describe verified impact" },
            ])
          }
        >
          + Add result
        </button>
        <h2>Leadership</h2>
        {value.leadership.map((a, i) => (
          <fieldset key={i}>
            {field("Title", a.title, (v) =>
              update(
                "leadership",
                value.leadership.map((x, j) =>
                  j === i ? { ...x, title: v } : x,
                ),
              ),
            )}
            {field(
              "Description",
              a.description,
              (v) =>
                update(
                  "leadership",
                  value.leadership.map((x, j) =>
                    j === i ? { ...x, description: v } : x,
                  ),
                ),
              true,
            )}
            <button
              type="button"
              onClick={() =>
                update(
                  "leadership",
                  value.leadership.filter((_, j) => j !== i),
                )
              }
            >
              Remove role
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() =>
            update("leadership", [
              ...value.leadership,
              { title: "New role", description: "Describe your contribution." },
            ])
          }
        >
          + Add role
        </button>
        <p role="status" className={message ? "config-message" : ""}>
          {message}
        </p>
        <button className="primary" disabled={saving}>
          {saving ? "Saving…" : "Save portfolio content"}
        </button>{" "}
        <Link href="/" target="_blank">
          Preview website ↗
        </Link>
      </form>
    </main>
  );
}
