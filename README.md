# Kaplay Inspector

A dev tool for [Kaplay](https://kaplayjs.com/) which allows you to explore and inspect the game object tree real time.

Check the demo: [muffinman.io/kaplay-inspector/](https://muffinman.io/kaplay-inspector/).

[![Kaplay inspector in action](./public/screenshot.png)](https://muffinman.io/kaplay-inspector/)

## Features

- Navigate the game object tree
- Updates every 100ms (configurable)
- Hover an object to draw it's area, anchor and bounding box
- Inspect object's component and custom props
- Log an object to console
- Tweak object properties live
  - position, scale, rotate, skew, z-index
  - opacity, color, blend mode
  - text
  - anchor
  - health
- Pause objects
- Hide objects
- Search for tags or comps
- Record video of the game
- Dark theme (is this a feature?)

The layout is made with desktop in mind. That said, it is somewhat usable on phones.

## Usage

Install it:

```sh
npm install @stanko/kaplay-inspector
```

This is a dev tool, so I strongly recommend you import it only in development mode. This will prevent from the inspector showing up when you ship your game to players.

If you are using vite, it exposes the dev flag in `import.meta.env.DEV`. For other bundlers check their documentation.

You'll need to import the CSS and `init` method, here is an example using vite:

```ts
import kaplay from "kaplay";

// Init you kaplay game
const k = kaplay({});

if (
  // Make sure to load it only in development mode
  import.meta.env.DEV &&
  // I like to enable it only when ?inspector is available in the URL (this is optional)
  // This gives you an easy way to enable or disable it
  new URLSearchParams(window.location.search).get("inspector") !== null
) {
  import("@stanko/kaplay-inspector/dist/styles.css");
  import("@stanko/kaplay-inspector").then(({ default: init }) => {
    // Pass the "k" instance to the inspector
    init(k);
  });
}
```

If typescript is complaining about importing CSS files, you probably need to add this to `declaration.d.ts` file in you project's root.

```ts
declare module "*.scss";
```

### Options

You can pass options object to the init method as a second parameter:

```ts
init(k, {
  initUpdateTimeout: 100,
});
```

available options are:

```ts
interface InspectorOptions {
  // CSS class to add to the root element
  className?: string;
  // is inspector visible on load, default: true
  isVisibleOnLoad?: boolean;
  // default update time in milliseconds, default: 250
  initUpdateTimeout?: number;
  // should area, anchor and bounding box be drawn on object hover, default: true
  initDrawInspectOnHover?: boolean;
  // persist inspector visibility between page loads, default: false
  saveVisibleState?: boolean;
  // persist the search input between page loads, default: true
  saveSearch?: boolean;
}
```

## Customizing colors

Kaplay Inspector defines colors in [OKLCH color space](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch). This makes changing of the primary and the secondary color pretty straight forward. You only need to update two hue variables like this:

```css
.k-inspector.your-custom-class {
  --ki-h: 300; /* Purple */
  --ki-h-secondary: 200; /* Teal */
}
```

Please note that if you load inspector's CSS dynamically, you'll have to add a custom class to create a higher specificity selector.

If you want to change other colors as well, check the [styles.css](./src/styles/styles.css).

## Positioning

By default, the inspector has `position: fixed` and it sits at the bottom of the screen. If you want to move it around, the easiest way it to pass a custom class name through the options and position it yourself.

Assuming we have only the canvas and the inspector element on the page, here is an example of what I like to do:

```css
body:has(.k-inspector__hide) {
  display: grid;
  grid-template-rows: 60vh 40vh;

  canvas {
    width: 100% !important;
    height: 60vh !important;
    object-fit: contain;
    display: block;
  }

  .k-inspector {
    position: relative;
  }
}
```

This fixed the game canvas in the upper part of the viewport (60% of it) and the bottom part is taken by the inspector. It only applies this layout when inspector is visible (by checking if the hide button is shown).

Same as with colors, be sure to have a higher specificity selector if inspector's CSS is loaded dynamically.

## TODO

- [ ] Controllable theme - system/light/dark. At the moment it is always matching the system.
- [ ] Mouse inspect
- [ ] Add clear button on search
- [ ] Nested game objects
- [ ] On scene change live search doesn't work
- [x] Draw bounding box on top of everything
- [x] Fix Inspect not working on search
- [x] Persist search/options in URL or local storage
- [x] Persist is visible in local storage
