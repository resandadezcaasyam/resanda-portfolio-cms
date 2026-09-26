# New portrait placement

All four supplied photographs were edited with the built-in image generation tool, preserving photographic subjects and extracting transparent backgrounds. Original attachment files were left unchanged.

| Source | Output | Placement | Background |
|---|---|---|---|
| Image 1 | `public/images/resanda-seated.png` | About and Contact | Lavender panel, orange halftone circle |
| Image 2 | `public/images/resanda-laptop.png` | Preserved asset, no longer displayed on Contact | Transparent cutout; laptop preserved |
| Image 3 | `public/images/resanda-casual.png` | Home hero | Existing cream/orange anime editorial frame |
| Image 4 | `public/images/resanda-marker.png` | Experience sidebar | Lavender panel, yellow arch; marker preserved |

Cutouts retain alpha and use `object-fit: contain` to preserve faces and hands across viewport sizes. Labels sit below the three editorial portraits, so they do not cover the subject. The existing pointer tilt and reduced-motion controls apply to the new panels.

## Generation prompts

Verification: all four output PNGs have real transparency. The four consuming pages returned HTTP 200 and rendered the intended new image at 1440, 390 and 320 px, with no horizontal overflow or browser page errors. Desktop and mobile portrait screenshots in `artifacts/portraits/` were visually reviewed for facial visibility, hands, laptop, marker, and framing. TypeScript validation passed (`npx tsc --noEmit`).

Recheck with `node scripts/verify-portraits.cjs` while the local server runs on port 3000.

### Image 1
Use case: background-extraction. Edit only this supplied portrait photograph. Remove the stairs, building, black bag at left, border, and all surrounding background. Keep only the seated man, his exact face, hairstyle, expression, white shirt, black trousers, hands, pose and body proportions. Preserve photographic identity and original framing; do not invent missing limbs. Output genuine transparent PNG with alpha, clean natural hair and clothing edges, no painted checkerboard, no backdrop, no shadows, no text. Gently balance exposure only; no facial retouching or anime transformation. This is an About-page portrait on a cream/lavender website.

### Image 2
Use case: background-extraction. Edit this supplied photograph for a portfolio Contact-page portrait. Remove only all glass-building surroundings and white photo border. Preserve the exact person, face, hairstyle, chin resting on hand, white shirt, bent arms, laptop in foreground and original pose/framing. Keep the laptop with the subject. Genuine transparent PNG alpha outside the person and laptop, clean natural edges. No replacement scenery, no checkerboard, no shadow, no text. Gentle neutral exposure correction only; preserve identity and photographic appearance, do not change facial features or convert person to anime.

### Image 3
Use case: background-extraction. Remove the full building and foliage background and white border of this supplied portrait. Keep only the man in black shirt with his black backpack and straps. Preserve exact face, hair, subtle smile, over-shoulder pose, clothing, proportions and original crop. This is the primary hero portrait on a Japanese-anime-inspired portfolio, but the person must stay photographic and identifiable, not illustrated. Output a genuine transparent PNG with alpha, natural hair edges, no backdrop or checkerboard, no new objects, no typography. Mild exposure balance for a clear face and detailed black clothing, no beauty retouching.

### Image 4
Use case: background-extraction. Edit only the supplied photograph. Remove the whiteboard, grey walls, border, dark corner at bottom left and all surrounding background. Preserve only the exact man in his white shirt holding the marker with both hands. Preserve his face, sideways gaze, hair, expression, fingers, marker, pose and original body crop precisely. Do not invent a presentation or audience. Natural photographic person, no anime conversion or facial retouching. Output real transparent PNG alpha, clean edges with no fringe, no painted checkerboard, no background, shadow or text. Mild neutral exposure adjustment only. This cutout will be set into a lavender editorial Experience-page card.
