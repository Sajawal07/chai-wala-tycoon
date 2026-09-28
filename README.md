# Chai Wala Tycoon

A playable, responsive browser interpretation of the Chai Wala Tycoon game concept. Built with React, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

## Play

1. Tap **Brew chai**, click the illustrated stove, or press **B**.
2. Once the water is warm, tap the ingredients or drag them onto the pot.
3. Let the batch brew. The starting pot makes two cups.
4. Serve the first customer in line. For drinks, tap **Serve chai**, tap their drink action, drag a cup onto their order, or press **S**.
5. At level 2, Biscuits unlock in **Upgrade shop > Snacks & stock**. Buy a batch, then tap **Serve Biscuits** on the first customer's order. Rusk, Samosa, Cake, and Pakora unlock at levels 3-6, with more snacks later.
6. Spend earnings on stock, equipment, flavors, decorations, and staff.

Your first customers wait without losing patience until your first complete order. After that, fast service earns tips and slow service can cost coins and reputation. A customer who receives tea but not their side item stays first in line; payment is awarded only when their whole order is complete. If they leave, the existing incomplete-order penalty applies. Restocking in the shop does not pause the queue. Use the small reset icon above the main action to empty a batch when you want to change recipes.

## Included

- Four custom-illustrated locations with lifetime-earnings requirements and expansion costs.
- Classic chai, ginger chai, cardamom chai, sweet lassi, and level-gated snack stock.
- Separate, persistent inventories for Biscuits, Rusk, Samosa, Cake, Pakora, Jalebi, Bun maska, and Kachori.
- Four upgrade tracks, a festival cosmetic, and five specialized staff roles.
- Customer patience, tips, reputation, and a timing-based bargaining minigame.
- Rain bonuses, hot-weather lassi bonuses, a cricket rush, and a free timed speed boost.
- Daily goals, claimable achievements, level progression, and keyboard controls.
- Animated steam, rain, ingredient feedback, coin rewards, and location celebrations.
- Optional synthesized sound effects and reduced-motion support.
- Automatic browser-local saves and capped offline earnings with a fully hired team.
- Mobile tap controls, desktop drag-and-drop, fullscreen, and pause controls.

## Queue And Stock Checks

- Tea + Samosa before Tea: serving the first tea leaves "Waiting for Samosa..."; the second tea cannot be served until the Samosa is served or the first customer leaves.
- Tea before Tea + Samosa: completing the first tea advances the queue, then the second customer becomes active.
- With Samosa stock at zero, the restock action appears, serving is blocked, and the first customer's patience continues while the shop is open.
- After serving tea but not Samosa, the first customer's departure incurs the existing partial-order penalty and advances the queue.
- Serving the last Samosa makes stock zero; a later Samosa order offers Restock instead of Serve. Stock is never decremented for a rejected serve.
- Stock and unlocks are saved locally and remain intact across customer arrivals, day transitions, speed changes, and stove switches.

## Project

- `src/App.tsx`: game interface and main play scene.
- `src/game.ts`: simulation, progression, game data, audio, and local persistence.
- `src/components/Overlays.tsx`: shops, management screens, guide, settings, and minigames.
- `src/components/Dialog.tsx`: accessible, focus-managed dialogs.
- `src/components/Illustrations.tsx`: original SVG interface illustrations.
- `src/index.css`: responsive visual system and ambient animations.
- `public/images/`: custom illustrated neighborhood environments.

Use the existing `dev` script for local development and `build` for production. No API key or backend is required. Google Fonts is used for typography; local font fallbacks are provided.

## Scope

This is a browser game, not a Flutter/Flame project or an Android App Bundle. Saves use browser local storage rather than Hive. The free boost does not display or simulate an actual ad impression. Cosmetics use earned game coins, with no real-money billing. Play Store publishing, native ads and purchases, online leaderboards, voice clips, and native device testing are outside this implementation.

The production build has been verified. Interactive browser and Android device tests have not been run in the build environment; the scenarios above are a manual QA checklist, not a claim that device tests were executed.