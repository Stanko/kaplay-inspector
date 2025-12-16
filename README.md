# Kaplay Inspector

A dev tool for [Kaplay](https://kaplayjs.com/) which allows you to explore and inspect the game object tree real time.

![Kaplay inspector in action](./public/screenshot.png)

## Features

- Navigate the game object tree
- Updates every 100ms (configurable) 
- Hover an object to draw it's area, anchor and bounding box
- Inspect object's component and custom props
- Log an object to console
- Tweak position and text
- Pause an object
- Dark theme (is this a feature?)

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
const k = kaplay({})

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

### Options

You can pass options object to the init method as a second parameter:

```ts
init(k, {
  updateTimeout: 100,
})
```

available options are:

```ts
interface InspectorOptions {
  updateTimeout?: number; // in milliseconds
}
```


## TODO

* [ ] Show/Hide button
* [ ] Bounding box - handle a case when anchor is a `Vec2`
* [ ] Controllable theme - system/light/dark. At the moment it is always matching the system.
* [ ] Filter/search
* [ ] Persist search in URL or local storage
* [ ] Build and deploy simple demo
* [ ] Figure out why child bounding box are drawn in the wrong position
* [ ] Check if all of CSS is namespaced
* [ ] Add documentation about positioning the inspector
* [ ] Collapse/Expand all button
