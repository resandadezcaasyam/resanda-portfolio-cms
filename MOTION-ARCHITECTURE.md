# Continuous portfolio world

## Audit and preservation

The previous frontend created a separate coastal GLB canvas in page heroes. Public content was spread across page JSX; only projects, experiences and profile had a store. Existing project slugs, API routes, publication states, search, external resources, contact composer, portraits and original CV are preserved. The old Blender source and GLB remain in the repository, but are not loaded by the new public world.

## Runtime architecture

- `app/layout.tsx` owns `WorldProvider`, so its WebGL canvas survives public client-side route changes.
- `components/world/journey.tsx` renders accessible HTML from server-provided CMS data. Direct chapter URLs enter the corresponding chapter of the same journey.
- GSAP ScrollTrigger writes chapter, local progress and overall progress into `components/world/state.ts`. This is a mutable animation bridge, not React state updated every frame.
- `components/world/universe.tsx` reads that timeline in R3F. A shared core, rings and instanced nodes transform across the seven chapters. Career stations, project planes and milestone geometry are instanced and their visible counts come from CMS data.
- The core has a small custom Fresnel shader. Drei supplies a locally generated light environment, AdaptiveDpr and PerformanceMonitor. No remote HDR, texture download or post-processing stack is required.
- Lenis drives smooth wheel scrolling and chapter anchors. Native touch scrolling remains available. Motion handles project hover and expertise node interactions.
- HTML stays available without JavaScript or WebGL. A CSS environment fallback replaces the canvas if unavailable. Images keep explicit dimensions.

## Chapters

1. Hero: metallic orbital system and layered editorial introduction.
2. About: expanded connected ecosystem, transparent portrait and verified impact.
3. Experience: camera follows a sequence of station portals driven by career records.
4. Projects: project planes arranged in depth; a readable HTML gallery with search, category filters and preserved case-study URLs.
5. Expertise: connected discipline nodes reveal CMS-managed descriptions and tools.
6. Achievements: spatial milestone symbols and leadership notes.
7. Contact: core convergence, email, LinkedIn, optional GitHub, original resume PDF and email composer.

Chapter duration follows content length, so adding an experience or project extends its part of the journey rather than squeezing new text into a hardcoded percentage. Transitions overlap in the last part of each chapter. Public detail pages continue using the existing canvas and have their own scroll path.

## Performance and accessibility

The renderer is dynamically imported. Desktop DPR is capped at 1.5; mobile at 1, with an automatic downgrade to 0.85 on sustained slow rendering. Mobile uses 70 particles instead of 220 and lower geometry segments. Instanced chapter geometry is hidden outside its relevant transition. Geometry is procedural: the current abstract environment does not need a GLB or compressed textures.

Reduced motion fixes the camera, removes HTML parallax, disables smooth scrolling and uses on-demand rendering. The pause control persists locally. Hidden tabs also switch to demand rendering. Keyboard links, a skip link, visible focus rings, semantic headings, native controls and selectable HTML text remain available.

## CMS and storage

- Existing `/admin`, `/admin/projects`, `/admin/experiences` and `/admin/profile` remain conventional.
- `/admin/world` edits biography, education, skills, achievements, impact, leadership and external links.
- `/api/world` validates the configuration with Zod. Empty GitHub is intentional until a real URL is supplied.
- Local writes are atomic JSON files under `data/`, with serialized updates for existing portfolio records. These files survive server restarts and are excluded from version control.
- With Supabase configured, existing tables remain in use and `supabase/world-config.sql` adds the configuration table. Local JSON storage requires a writable persistent disk; serverless deployments should use Supabase.

## Verification

`npm run build` includes TypeScript checking. `scripts/audit-world.cjs` checks public/admin routes, mobile layout, scene continuity, reduced motion and WebGL fallback. `scripts/verify-world-behavior.cjs` asserts CMS propagation, invalid-link validation, filtering, canvas persistence, contact/CV links, CMS saving and no-JavaScript content. Screenshots are in `artifacts/world-*.png`.
