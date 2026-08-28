# Kaplay Inspector

A dev tool for [Kaplay](https://kaplayjs.com/) which allows you to explore and inspect the game object tree in real time.

Check the demo: [muffinman.io/kaplay-inspector/](https://muffinman.io/kaplay-inspector/).

[![Kaplay inspector in action](./public/screenshot.png)](https://muffinman.io/kaplay-inspector/)

## Features

- Navigate the game object tree
- Updates every 250ms (configurable) by polling
- Use your mouse to select an element directly from the game
- Draw the inspected element's area, anchor and bounding box
- Inspect system and custom component properties and update them live
- You can tweak pretty much anything, for example:
  - boolean (hidden, paused)
  - number (opacity, rotate, z-index)
  - string (text)
  - vector (position, scale)
  - game object (children, object reference)
  - color
- Custom controls for certain system components like anchor, blend mode or sprite
- Log an object to the console
- Search for tags or components
- Record video of the game
- See GPU textures
- Saves basic settings and search term across browser refreshes
- Light/dark/system theme (is this a feature?)

The layout is made with desktop in mind. That said, it is somewhat usable on phones.

## Usage

Install it:

```sh
npm install @stanko/kaplay-inspector
```

This is a dev tool, so I strongly recommend you import it only in development mode. This will prevent the inspector from showing up when you ship your game to players.

If you are using Vite, it exposes the dev flag in `import.meta.env.DEV`. For other bundlers, check their documentation.

You'll need to import the CSS and `init` method. Here's an example using Vite:

```ts
import kaplay from "kaplay";

// Init your Kaplay game
const k = kaplay({});

// Make sure to load it only in development mode
if (import.meta.env.DEV) {
  import("@stanko/kaplay-inspector/dist/styles.css");
  import("@stanko/kaplay-inspector").then(({ default: init }) => {
    // Pass the "k" instance to the inspector
    init(k);
  });
}
```

If TypeScript is complaining about importing CSS files, you probably need to add this to the `declaration.d.ts` file in your project's root.

```ts
declare module "*.css";
```

### Options

`init` accepts an optional second argument for styling the inspector:

```ts
export interface InspectorOptions {
  /** CSS class to add to the root element */
  className?: string;
  /** Interface theme, default: "system" */
  theme?: "light" | "dark" | "system";
}
```

## Customizing colors

Kaplay Inspector defines colors in [OKLCH color space](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch). This makes changing the primary and secondary colors pretty straightforward. You only need to update two hue variables like this:

```css
.kaplay-inspector.your-custom-class {
  --ki-h: 300; /* Purple */
  --ki-h-secondary: 200; /* Teal */
}
```

If you load the inspector's CSS dynamically, use `className` to add a class with enough specificity.

If you want to change other colors as well, check the [_variables.scss](./src/styles/_variables.scss).

## Positioning

By default, the inspector has `position: fixed` and sits at the bottom of the screen. Dragging its top edge resizes it by updating the `--ki-height` CSS variable. You can pass a `className` and use CSS to update the positioning.

Assuming there are only the canvas and the inspector element on the page, here's an example of what I like to do:

```css
/* If the hide button is shown, it means the Kaplay inspector is visible */
body:has(.ki-hide-inspector) {
  --ki-height: 45vh;
  --game-height: calc(100vh - var(--ki-height));

  display: grid;
  grid-template-rows: var(--game-height) var(--ki-height);

  canvas {
    width: 100% !important;
    height: var(--game-height) !important;
    object-fit: contain;
    display: block;
  }

  .kaplay-inspector {
    position: relative;
  }
}
```

This initially gives the game canvas the upper 55% of the viewport and the inspector the remaining 45%. Dragging the inspector's top edge updates both regions through `--ki-height`. It only applies this layout when the inspector is visible (by checking if the hide button is shown).

As with colors, be sure to use a higher-specificity selector if the inspector's CSS is loaded dynamically.

## TODO

Done for now :)
