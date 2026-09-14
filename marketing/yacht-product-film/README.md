# Yacht Riviera Maya — Product Film V1

Commercial product film built with HyperFrames and GSAP from the real Yacht RM
visual system, local imagery and James Miller demo flow.

## Format

- 1920 × 1080, 16:9
- 30 seconds at 30 fps
- No voiceover or external media

## Timeline

| Time | Scene |
| --- | --- |
| 00:00–00:03 | Luxury hero opening |
| 00:03–00:06 | Global operational overview |
| 00:06–00:10 | Instagram message → lead |
| 00:10–00:14 | Lead → quote |
| 00:14–00:18 | Quote → booking and margin |
| 00:18–00:21 | Booking → operation |
| 00:21–00:24 | Finance impact |
| 00:24–00:27 | Multi-destination context |
| 00:27–00:30 | Luxury closing |

## Commands

```bash
npm run check
npx --yes hyperframes@0.8.40 preview --background --port 4567
npm run render -- --fps 30 --quality draft --output renders/yacht-riviera-maya-product-film-v1-draft.mp4
```

The project is isolated from the production Next.js app. Media contains local
copies of existing repository assets.
