# Yacht Riviera Maya Product Film — Visual Direction

## Intent

The film presents the real Yacht Riviera Maya product as a premium operational
system: luxury hospitality on the surface, disciplined commercial intelligence
underneath. It must feel credible in a client meeting without audio.

## Mood

Cinematic luxury + operational intelligence. Restrained, precise, confident,
and warm enough to remain rooted in Riviera Maya hospitality.

## Brand feel

Premium Riviera Maya concierge business. Luxury travel meets serious
operational software. The yacht imagery carries desire; the interface carries
control. Neither should overpower the other.

## Canvas and color

These values come directly from `app/globals.css`:

- Abyss `#050a14` — primary cinematic canvas.
- Midnight `#071120` — secondary background.
- Deep Ocean `#0a192c` — panels and UI fields.
- Surface `#10243a` — elevated operational surfaces.
- Riviera Blue `#159dd1` — primary brand/action color.
- Caribbean Blue `#32c5f4` — controlled highlight only.
- Warm White `#f4f8fb` — primary typography.
- Mist `#a9bac8` — supporting typography.
- Steel `#60778a` — metadata.
- Border `#1c3143` — structure and dividers.
- Success `#6ca88f`, warning `#bd9256`, danger `#b96f6f` — status only.

Avoid full-frame linear gradients. Use solid navy, photography with navy
overlays, thin rules, and localized radial light when depth is needed.

## Typography

- Display/editorial voice: **Cormorant Garamond**, matching the current public
  site and dashboard headings. Use at large video sizes with restrained weight.
- Interface/data voice: **DM Sans**, matching the real product.
- Data uses tabular numerals. Labels are uppercase with measured tracking.

This pairing is retained because it is the product's existing identity. Display
headlines are 60px or larger; body copy is at least 20px; data labels are at
least 16px for rendered legibility.

## Layout language

- Use the product's sidebar, topbar, hairline borders, compact status pills,
  structured grids, and editorial photography.
- Core layouts use grid/flex and generous internal padding.
- UI cards remain relatively square with small, controlled radii.
- Shadows are deep and diffused, used to separate product windows from the
  cinematic background rather than to make cards float.
- Each scene has a clear primary focal point and one supporting focal point.

## Motion

- Precise, elegant, controlled, cinematic.
- Slow image push-ins and focus-pull/blur crossfades for luxury moments.
- Directional pushes and tighter stagger for workflow conversion.
- Smooth camera moves over UI, primarily transform and opacity.
- Entrances build hierarchy; transitions perform scene exits.
- No infinite loops, random timing, or non-deterministic motion.
- Faster motion is reserved for message → lead → quote → booking conversion.

## Transition system

- Primary: gentle blur crossfade/focus pull, 0.5–0.7 seconds.
- Workflow accent: controlled horizontal push, 0.35–0.45 seconds.
- Closing: slow color dip to Abyss.

## Imagery

Use only existing local assets from `public/demo/`, led by `yacht-main.jpg` and
supported by `yacht-alt.jpg`, `experience.jpg`, `mobility.jpg`, and existing
talent imagery when relevant. Apply navy overlays consistent with the public
website.

## What NOT to do

- No neon gradients.
- No cyberpunk glow.
- No random floating cards.
- No excessive glassmorphism.
- No exaggerated 3D rotations.
- No stock SaaS motion language.
- No cartoon transitions.
- No particle spam.
- No fake futuristic HUD.
- No rainbow UI.
- No generic AI-generated visual language.
- No redesign of Yacht Riviera Maya.
- No showing ten features at once.
- No clutter.
- No text-heavy scenes.
