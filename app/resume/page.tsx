import { getProfile, getExperiences, getProjects } from "@/lib/store";
import { getWorldConfig } from "@/lib/world-store";
import { WorldNav } from "@/components/world/journey";
export const dynamic = "force-dynamic";
export default async function Resume() {
  const [profile, experiences, projects, config] = await Promise.all([
    getProfile(),
    getExperiences(),
    getProjects(),
    getWorldConfig(),
  ]);
  return (
    <div className="public-world">
      <WorldNav />
      <main id="main-content" className="resume-sheet">
        <p className="world-eyebrow">RESUME / PROFESSIONAL SUMMARY</p>
        <h1>{profile.name}</h1>
        <p>{profile.headline}</p>
        <p>
          {profile.location} ·{" "}
          <a href={"mailto:" + profile.email}>{profile.email}</a> ·{" "}
          <a href={profile.linkedin}>LinkedIn</a>
        </p>
        <h2>Profile</h2>
        {config.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <h2>Experience</h2>
        {experiences.map((e) => (
          <article key={e.id}>
            <h3>
              {e.company} · {e.position}
            </h3>
            <p>{e.period}</p>
            <p>{e.description}</p>
            {e.highlights?.map((h) => (
              <p key={h}>• {h}</p>
            ))}
          </article>
        ))}
        <h2>Selected projects</h2>
        {projects.map((p) => (
          <article key={p.id}>
            <h3>
              <a href={"/projects/" + p.slug}>{p.title} ↗</a>
            </h3>
            <p>{p.summary}</p>
          </article>
        ))}
        <h2>Education</h2>
        <p>{config.education}</p>
        <h2>Expertise</h2>
        {config.skills.map((s) => (
          <p key={s.id}>
            <strong>{s.name}:</strong> {s.tools.join(", ")}
          </p>
        ))}
        <h2>Achievements</h2>
        {config.achievements.map((a) => (
          <p key={a.id}>
            {a.year} · {a.rank}, {a.title} · {a.organization}
          </p>
        ))}
      </main>
    </div>
  );
}
