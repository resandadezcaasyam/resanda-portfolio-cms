import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/store";
import { WorldNav } from "@/components/world/journey";
import { CaseMotion } from "@/components/world/case-motion";
export const dynamic = "force-dynamic";
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const all = await getProjects();
  const next =
    all[(all.findIndex((p) => p.id === project.id) + 1) % all.length];
  return (
    <div className="public-world">
      <WorldNav active="projects" />
      <CaseMotion />
      <main id="main-content" className="world-case">
        <header className="world-case-header">
          <Link className="world-link" href="/projects">
            ← The project gallery
          </Link>
          <p className="world-eyebrow">PROJECT NOTES / {project.category}</p>
          <h1>{project.title}</h1>
          <p className="world-intro">{project.summary}</p>
          <div className="world-case-meta">
            {[
              ["ROLE", project.role || "Product"],
              ["PERIOD", project.duration || "Project exploration"],
              ["FOCUS", project.tags.join(" · ")],
            ].map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </header>
        <section className="world-case-content">
          <nav className="world-case-index" aria-label="Case study sections">
            <a href="#challenge">01 / The challenge</a>
            <a href="#approach">02 / The approach</a>
            <a href="#outcome">03 / The outcome</a>
          </nav>
          <div>
            {[
              [
                "challenge",
                "01",
                "Find the real friction.",
                project.challenge || project.summary,
              ],
              [
                "approach",
                "02",
                "Design for the decision.",
                project.case_study || project.summary,
              ],
              [
                "outcome",
                "03",
                "Make work move forward.",
                project.outcome ||
                  "Further project outcomes have not been published.",
              ],
            ].map(([id, num, title, copy]) => (
              <article id={id} key={id}>
                <p className="world-eyebrow">
                  {num} / {id}
                </p>
                <h2>{title}</h2>
                <p>{copy}</p>
              </article>
            ))}
            {project.destination_type !== "internal" &&
              project.destination_url && (
                <a
                  className="world-button"
                  href={project.destination_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open project resource ↗
                </a>
              )}
            {next && next.id !== project.id && (
              <Link className="world-button" href={"/projects/" + next.slug}>
                Next: {next.title} ↗
              </Link>
            )}
          </div>
        </section>
      </main>
      <footer className="world-footer">
        <Link href="/contact">Let’s build something meaningful ↗</Link>
        <Link href="/projects">All projects</Link>
      </footer>
    </div>
  );
}
