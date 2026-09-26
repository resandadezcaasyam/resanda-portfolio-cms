"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Project, Experience, Profile } from "@/lib/content";
import type { WorldConfig } from "@/lib/world-config";
import { ContactComposer } from "@/components/contact-composer";
import { worldState, chapters } from "./state";
gsap.registerPlugin(ScrollTrigger);
export type JourneyData = {
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
  config: WorldConfig;
};
export function WorldNav({
  active = "home",
  local = false,
}: {
  active?: string;
  local?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const NavigationLink = local ? "a" : Link;
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <>
      <a href="#main-content" className="world-skip">
        Skip to content
      </a>
      <header className="world-nav">
        <NavigationLink
          href={local ? "#home" : "/"}
          className="world-brand"
          aria-label="Resanda Dezca home"
        >
          rd<span>·</span>
        </NavigationLink>
        <button
          className="world-menu"
          aria-expanded={open}
          aria-controls="world-links"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Explore"}
        </button>
        <nav id="world-links" className={open ? "is-open" : ""}>
          {["home", "about", "experience", "projects", "skills", "contact"].map(
            (name) => (
              <NavigationLink
                key={name}
                href={local ? "#" + name : name === "home" ? "/" : "/" + name}
                aria-current={active === name ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                {name === "home"
                  ? "Overview"
                  : name[0].toUpperCase() + name.slice(1)}
              </NavigationLink>
            ),
          )}
        </nav>
        <NavigationLink className="world-nav-cta" href={local ? "#contact" : "/contact"}>
          Let’s talk <span>↗</span>
        </NavigationLink>
      </header>
    </>
  );
}
export function Journey({
  profile,
  projects,
  experiences,
  config,
  initial = "home",
}: JourneyData & { initial?: string }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(initial),
    [skill, setSkill] = useState(0),
    [filter, setFilter] = useState(""),
    [query, setQuery] = useState(""),
    [paused, setPaused] = useState(false);
  const filtered = projects.filter(
    (p) =>
      (!filter || p.category === filter) &&
      (!query ||
        [p.title, p.summary, ...p.tags]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())),
  );
  const currentSkill = config.skills[skill] || config.skills[0];
  useEffect(() => {
    worldState.counts = {
      experience: experiences.length,
      projects: filtered.length,
      skills: config.skills.length,
      achievements: config.achievements.length,
    };
  }, [experiences.length, filtered.length, config]);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let lenis: Lenis | undefined;
    let ctx: gsap.Context | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let last = "";
    const setup = () => {
      ctx?.revert();
      lenis?.destroy();
      const reduced =
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
        localStorage.getItem("portfolio-motion") === "off";
      setPaused(reduced);
      if (!reduced) {
        lenis = new Lenis({
          autoRaf: true,
          anchors: true,
          duration: 1.05,
          smoothWheel: true,
        });
        lenis.on("scroll", ScrollTrigger.update);
      } else lenis = undefined;
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            worldState.progress = self.progress;
          },
        });
        const beats = Array.from(
          el.querySelectorAll<HTMLElement>("[data-beat]"),
        );
        beats.forEach((beat) => {
          const chapter = Number(beat.dataset.beat),
            part = Number(beat.dataset.part || 0),
            total = Number(beat.dataset.total || 1);
          const update = (p: number) => {
            worldState.chapter = chapter;
            worldState.local = (part + p) / total;
            if (last !== chapters[chapter]) {
              last = chapters[chapter];
              setActive(last);
            }
            window.dispatchEvent(new Event("world-frame"));
          };
          ScrollTrigger.create({
            trigger: beat,
            start: "top 45%",
            end: "bottom 45%",
            onToggle: (self) => {
              if (self.isActive) update(self.progress);
            },
            onUpdate: (self) => {
              if (self.isActive) update(self.progress);
            },
          });
          if (!reduced) {
            gsap.fromTo(
              beat.querySelectorAll("[data-depth]"),
              { y: 45, rotationY: -3, z: -45 },
              {
                y: -25,
                rotationY: 1,
                z: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: beat,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          }
        });
        if (!reduced && matchMedia("(pointer: fine)").matches) {
          const buttons = el.querySelectorAll<HTMLElement>(".world-button");
          const cleanups = Array.from(buttons).map((button) => {
            const move = (event: PointerEvent) => {
              const rect = button.getBoundingClientRect();
              gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * .07, y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .3, overwrite: "auto" });
            };
            const reset = () => gsap.to(button, { x: 0, y: 0, duration: .4, overwrite: "auto" });
            button.addEventListener("pointermove", move);
            button.addEventListener("pointerleave", reset);
            return () => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", reset); gsap.killTweensOf(button); gsap.set(button, { clearProps: "transform" }); };
          });
          return () => cleanups.forEach(cleanup => cleanup());
        }
      });
      ScrollTrigger.refresh();
    };
    setup();
    const hash = location.hash.slice(1),
      target = document.getElementById(hash || initial);
    timer = setTimeout(() => {
      if (target && initial !== "home" && !hash)
        window.scrollTo({
          top: target.getBoundingClientRect().top + scrollY - 100,
          behavior: "instant",
        });
      ScrollTrigger.refresh();
    }, 120);
    window.addEventListener("portfolio-motion-change", setup);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", setup);
    return () => {
      clearTimeout(timer);
      ctx?.revert();
      lenis?.destroy();
      window.removeEventListener("portfolio-motion-change", setup);
      media.removeEventListener("change", setup);
    };
  }, [initial, filtered.length]);
  const tag = (n: string, title: string) => (
    <p className="world-eyebrow">
      <span>{n}</span>
      {title}
    </p>
  );
  return (
    <MotionConfig reducedMotion={paused ? "always" : "user"}>
      <div className="public-world">
        <WorldNav local active={active} />
        <aside className="chapter-rail" aria-label="Journey chapters">
          {chapters.map((name, i) => (
            <a
              href={"#" + name}
              key={name}
              className={active === name ? "active" : ""}
              aria-label={name}
              aria-current={active === name ? "location" : undefined}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <i />
            </a>
          ))}
        </aside>
        <main ref={root} id="main-content" className="journey">
          <section id="home" data-beat="0" className="world-section world-hero">
            <div className="hero-coordinate">
              PORTFOLIO / 2026<span>PRODUCT · DATA · AI</span>
            </div>
            <div className="world-copy" data-depth>
              {tag("01", profile.name.toUpperCase())}
              <h1>
                Human thinking.
                <br />
                <span>System-level</span>
                <br />
                impact.
              </h1>
              <p className="world-intro">{profile.bio}</p>
              <div className="world-actions">
                <a className="world-button" href="#projects">
                  Explore selected work <span>↗</span>
                </a>
                <a className="world-link" href="#about">
                  Meet {profile.name.split(" ")[0]} <span>↓</span>
                </a>
              </div>
            </div>
            <div className="core-caption">
              <span className="status-dot" /> CONNECTING PEOPLE, DATA &
              DECISIONS
            </div>
            <div className="hero-summary">
              <span>EXPERIENCE ACROSS</span>
              <div>
                {Array.from(new Set(experiences.map((e) => e.company)))
                  .slice(0, 5)
                  .map((company) => (
                    <span key={company}>{company}</span>
                  ))}
              </div>
              <a href="#experience">The journey ↓</a>
            </div>
          </section>
          <section
            id="about"
            data-beat="1"
            className="world-section world-about"
          >
            <div className="world-copy" data-depth>
              {tag("02", "THE HUMAN IN THE SYSTEM")}
              <h2>
                Curiosity,
                <br />
                with <em>direction.</em>
              </h2>
              <p className="world-intro">{profile.headline}</p>
              {config.about.map((text) => (
                <p key={text}>{text}</p>
              ))}
              <p className="world-education">{config.education}</p>
            </div>
            <figure className="world-portrait">
              <Image
                src="/images/resanda-casual.png"
                alt="Resanda Dezca Asyam"
                width={1159}
                height={1358}
                sizes="(max-width:760px) 70vw, 30vw"
              />
              <figcaption>
                {profile.name}
                <span>{profile.location}</span>
              </figcaption>
            </figure>
            <div className="world-impact">
              {config.impact.map((item) => (
                <div key={item.label}>
                  <b>{item.value}</b>
                  <span>{item.label}</span>
                </div>
              ))}
              <small>Selected outcomes reported in my CV.</small>
            </div>
          </section>
          <div id="experience" className="chapter-anchor" />
          <div className="career-route">
            <div className="route-label">
              03 / EXPERIENCE <span>A career built in motion</span>
            </div>
            {experiences.map((item, i) => (
              <section
                data-beat="2"
                data-part={i}
                data-total={experiences.length}
                className="world-section career-station"
                key={item.id}
              >
                <div className="station-coordinate">
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>/{String(experiences.length).padStart(2, "0")}</span>
                </div>
                <article className="world-copy" data-depth>
                  <p className="world-eyebrow">{item.period}</p>
                  <h2>{item.company}</h2>
                  <h3>{item.position}</h3>
                  <p>{item.description}</p>
                  {item.highlights?.length ? (
                    <ul>
                      {item.highlights.map((text) => (
                        <li key={text}>{text}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="world-tags">
                    {item.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </article>
                <div className="station-wayfinder" aria-hidden="true">
                  <span>{item.company.slice(0, 2).toUpperCase()}</span>
                  <i />
                  <small>CONNECTED / {String(i + 1).padStart(2, "0")}</small>
                </div>
              </section>
            ))}
          </div>
          <div id="projects" className="chapter-anchor" />
          <div className="project-gallery">
            <div className="gallery-header" data-beat="3" data-part="0" data-total={filtered.length + 1}>
              {tag("04", "SELECTED WORK")}
              <h2>
                Ideas made <em>useful.</em>
              </h2>
              <div className="gallery-controls">
                <label>
                  <span className="sr-only">Search projects</span>
                  <input
                    placeholder="Find a project…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label>
                  <span className="sr-only">Project category</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="">All disciplines</option>
                    {Array.from(new Set(projects.map((p) => p.category))).map(
                      (c) => (
                        <option key={c}>{c}</option>
                      ),
                    )}
                  </select>
                </label>
              </div>
            </div>
            {filtered.length === 0 && (
              <p className="empty-gallery">
                No projects match this search.{" "}
                <button
                  onClick={() => {
                    setQuery("");
                    setFilter("");
                  }}
                >
                  Reset filters
                </button>
              </p>
            )}
            {filtered.map((p, i) => (
              <section
                className="world-section gallery-stop"
                data-beat="3"
                data-part={i + 1}
                data-total={filtered.length + 1}
                key={p.id}
              >
                <motion.article
                  className="project-plane"
                  whileHover={{ rotateY: -3, rotateX: 1, y: -5 }}
                  transition={{ duration: 0.4 }}
                  onHoverStart={() => {
                    worldState.hover = i;
                  }}
                  onHoverEnd={() => {
                    worldState.hover = -1;
                  }}
                >
                  <div className="project-plane-top">
                    <span>PROJECT / {String(i + 1).padStart(2, "0")}</span>
                    <span>{p.category}</span>
                  </div>
                  <div className="project-map" aria-hidden="true">
                    <span>{p.tags[0] || "DISCOVERY"}</span>
                    <i />
                    <span>{p.tags[1] || "SYSTEM"}</span>
                    <i />
                    <span>{p.tags[2] || "IMPACT"}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <div className="project-plane-bottom">
                    <span>
                      {p.role}
                      <br />
                      <small>{p.duration}</small>
                    </span>
                    <Link href={"/projects/" + p.slug} className="world-link">
                      {p.cta_label} ↗
                    </Link>
                  </div>
                  {p.destination_type !== "internal" && p.destination_url && (
                    <a
                      className="world-link"
                      href={p.destination_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open resource ↗
                    </a>
                  )}
                </motion.article>
                <div className="gallery-counter" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                  <span> / {String(filtered.length).padStart(2, "0")}</span>
                </div>
              </section>
            ))}
          </div>
          <section
            id="skills"
            className="world-section expertise-section"
            data-beat="4"
          >
            <div className="world-copy" data-depth>
              {tag("05", "A CONNECTED PRACTICE")}
              <h2>
                Different disciplines.
                <br />
                <em>One way of thinking.</em>
              </h2>
              <p>
                Select a discipline to explore the tools and thinking behind my
                work.
              </p>
            </div>
            <div
              className="expertise-network"
              role="group"
              aria-label="Expertise disciplines"
            >
              <svg
                viewBox="0 0 600 360"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {config.skills.map((s, i) => (
                  <line
                    key={s.id}
                    x1="300"
                    y1="180"
                    x2={
                      300 +
                      Math.cos((i / config.skills.length) * Math.PI * 2) * 205
                    }
                    y2={
                      180 +
                      Math.sin((i / config.skills.length) * Math.PI * 2) * 135
                    }
                  />
                ))}
              </svg>
              <span className="network-centre" aria-hidden="true">
                Connected
                <br />
                thinking
              </span>
              {config.skills.map((s, i) => (
                <motion.button
                  key={s.id}
                  style={{
                    left: `${50 + Math.cos((i / config.skills.length) * Math.PI * 2) * 34}%`,
                    top: `${50 + Math.sin((i / config.skills.length) * Math.PI * 2) * 37}%`,
                  }}
                  className={skill === i ? "active" : ""}
                  aria-pressed={skill === i}
                  onClick={() => {
                    setSkill(i);
                    worldState.hover = i;
                    window.dispatchEvent(new Event("world-frame"));
                  }}
                  whileHover={{ scale: 1.04 }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.name}
                  <i>↗</i>
                </motion.button>
              ))}
            </div>
            {currentSkill && (
              <div className="expertise-detail" aria-live="polite">
                <h3>{currentSkill.name}</h3>
                <p>{currentSkill.description}</p>
                <div className="world-tags">
                  {currentSkill.tools.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
          <div id="achievements" className="chapter-anchor" />
          <div className="milestone-route">
            {config.achievements.map((a, i) => (
              <section
                className="world-section milestone-stop"
                data-beat="5"
                data-part={i}
                data-total={config.achievements.length}
                key={a.id}
              >
                <div className="world-copy" data-depth>
                  {tag("06", "MILESTONES / " + a.year)}
                  <span className="milestone-rank">{a.rank}</span>
                  <h2>{a.title}</h2>
                  <p className="world-eyebrow">{a.organization}</p>
                  <p>{a.description}</p>
                </div>
                <div className="milestone-seal" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                  <span>{a.year}</span>
                </div>
              </section>
            ))}
            <div className="leadership-notes">
              <h3>Growing with others.</h3>
              {config.leadership.map((l) => (
                <details key={l.title}>
                  <summary>
                    {l.title}
                    <span>+</span>
                  </summary>
                  <p>{l.description}</p>
                </details>
              ))}
            </div>
          </div>
          <section
            id="contact"
            data-beat="6"
            className="world-section world-contact"
          >
            <div className="world-copy" data-depth>
              {tag("07", "THE NEXT CHAPTER")}
              <h2>
                Let’s build
                <br />
                something
                <br />
                <em>meaningful.</em>
              </h2>
              <p>
                A product challenge. A new perspective. A conversation worth
                having.
              </p>
              <a href={"mailto:" + profile.email} className="contact-email">
                {profile.email} ↗
              </a>
              <div className="world-socials">
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
                {config.links.github && (
                  <a
                    href={config.links.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}
                <a
                  href={config.links.resume || profile.resume_url || "/resume"}
                >
                  Resume ↗
                </a>
              </div>
            </div>
            <ContactComposer email={profile.email} />
          </section>
        </main>
        <footer className="world-footer">
          <Link href="/">{profile.name}</Link>
          <span>{profile.location} · UTC+7</span>
          <a href="#home">Back to the beginning ↑</a>
          <Link href="/admin">Studio ↗</Link>
        </footer>
      </div>
    </MotionConfig>
  );
}
