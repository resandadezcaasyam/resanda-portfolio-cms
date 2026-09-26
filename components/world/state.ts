// Mutable animation state: ScrollTrigger writes, R3F reads. No React render per frame.
export const worldState = {
  chapter: 0,
  local: 0,
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  hover: -1,
  reduced: false,
  counts: { experience: 7, projects: 3, skills: 6, achievements: 3 },
};
export const chapters = [
  "home",
  "about",
  "experience",
  "projects",
  "skills",
  "achievements",
  "contact",
] as const;
