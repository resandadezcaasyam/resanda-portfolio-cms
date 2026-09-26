# Anime editorial redesign

## Review and changes
- Inner pages previously used bare headings and text lists; they now share illustrated chapter headers, panel borders, typography, spacing, colors, navigation and closing sections.
- Home, About and Contact use a transparent portrait. The actual PNG alpha channel was checked.
- Projects have shared animated concept diagrams, filters, search and empty states. Diagrams are labelled as concept visuals rather than product screenshots.
- Experience has a timeline with expandable role details. Achievements has award panels and leadership content. Case studies have an in-page index and next-project navigation.
- CMS overview, projects, experience and profile inherit the same visual system. Direct CMS section routes and a matching 404 page are included.
- Motion uses CSS perspective/transforms, a six-face 3D cube, pointer tilt, IntersectionObserver and the Web Animations API. Motion can be paused and respects reduced-motion settings. Native scrolling and text remain available without animation.
- Contact composes an email for the visitor to review and send in their email client; it does not claim a message was delivered.

## Assets
Created using the built-in image generation tool:
- `public/images/resanda-cutout.png`: background extraction from the existing portrait; the previous image is preserved.
- `public/images/anime-city.png`: original anime-inspired coastal city background.

Cutout prompt: Background extraction only. Remove the entire background from this portrait. Output a real transparent PNG with alpha channel. Preserve the man's exact photographic face, hair, expression, white shirt, pose and proportions. Only the person, clean hair and clothing edges. No backdrop, no shadow, no checkerboard painted in, no text. Do not turn the person into anime. Crop closely around the existing upper body.

Scene prompt: Create a panoramic 16:9 Japanese anime background illustration for a product manager portfolio website. A beautiful imaginary coastal Japanese city at blue hour, indigo roofs and overhead wires, luminous peach clouds, a sleek elevated train, distant ocean, small cherry blossom branches framing top corners. Detailed hand-painted anime cel background, deep ink blue outlines, muted lavender shadows, warm cream highlights, persimmon orange sunset. Composition: rich detail in lower two thirds, spacious sky above. Sophisticated nostalgic editorial mood. No people, no text, no letters, no logos, no watermark. This will be a recurring illustrated banner throughout a website.

## Verification
Run `node scripts/verify-ui.cjs` with the app running on port 3000. Browser screenshots are saved to `artifacts/ui/`. Run `npm run build` with the development server stopped to avoid sharing its Next.js build cache.

Verified: production build passed; 14 routes at 320, 390, 768 and 1440 px passed browser checks with no horizontal overflow or page JavaScript errors. Project search and filters, mobile navigation, expandable timeline, CMS new-project form, clipboard copying, and reduced-motion behavior passed. Separate browser checks confirmed changing cube transforms and responsive pointer tilt. Desktop and mobile screenshots were inspected.
