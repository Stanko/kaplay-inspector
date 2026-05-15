import kaplay from "kaplay";
import init from "./init";

import "./styles/demo.css";
import "./styles/styles.css";

const k = kaplay({
  global: false,
  width: 450,
  height: 300,
  pixelDensity: Math.min(window.devicePixelRatio, 2),
  debugKey: "d",
  scale: 1,
  background: "black",
  texFilter: "nearest",
  debug: true,
  crisp: true,
  canvas: document.querySelector(".game") as HTMLCanvasElement,
  buttons: {
    fire: {
      keyboard: ["z", "space"],
    },
  },
});

// ----- INIT INSPECTOR ----- //

init(k);

// ----- INIT GAME ----- //

k.loadRoot("./");

k.loadFont("nope8", "fonts/Nope8.woff", {
  filter: "nearest",
});

k.loadSprite("ship", "sprites/ship.png", {
  sliceX: 4,
  sliceY: 3,
});

// ----- MOON ----- //

k.loadSprite("moon", "sprites/moon.png", {
  sliceX: 15,
  sliceY: 10,
  anims: {
    main: { from: 0, to: 149, speed: 10, loop: true },
  },
});

k.add([
  "moon",
  k.sprite("moon", {
    anim: "main",
  }),
  k.anchor(k.vec2(-0.25, 0.75)),
  k.pos(k.randi(40, k.width() - 40), k.randi(40, k.height() - 40)),
  k.rotate(0),
  k.opacity(),
]);

// On update and onDraw are also game objects
k.onDraw(() => {});
k.onUpdate(() => {});

// ----- STARS ----- //

k.loadSprite("stars", "sprites/stars.png", {
  sliceX: 3,
  sliceY: 3,
});

const stars = k.add(["stars"]);

for (let i = 0; i < 30; i++) {
  const star = stars.add([
    "star",
    k.pos(k.randi(0, k.width()), k.randi(-k.height(), k.height())),
    k.sprite("stars", {
      frame: k.randi(0, 9),
    }),
    {
      speed: k.randi(50, 100),
    },
  ]);

  star.onUpdate(() => {
    star.move(0, star.speed);

    if (star.pos.y > k.height()) {
      star.pos = k.vec2(k.randi(0, k.width()), k.randi(0, -k.height()));
    }
  });
}

// ----- TEXT ----- //

k.add([
  "title",
  k.anchor("top"),
  k.pos(k.width() / 2, 30),
  k.text("Kaplay Inspector", {
    font: "nope8",
    size: 32,
  }),
]);

k.add([
  "text",
  k.anchor("top"),
  k.color(130, 130, 150),
  k.pos(k.width() / 2, 70),
  k.text(
    "On the bottom you should see the inspector. You can use it to inspect this game and manipulate objects. Try changing the text or moving things around.",
    {
      font: "nope8",
      size: 12,
      width: 202,
    },
  ),
]);

// ----- SHIP ----- //

k.loadSprite("ship", "sprites/ship.png", {
  sliceX: 4,
  sliceY: 3,
});

const hpLabel = k.add([
  "hp-label",
  k.pos(10, 10),
  k.anchor("topleft"),
  k.opacity(0.6),
  k.text("HP: 5", {
    font: "nope8",
    size: 12,
  }),
  {
    updateHP() {
      hpLabel.text = `Ship HP: ${ship.hp} / ${ship.maxHP}`;
    },
  },
]);

const ship = k.add([
  "ship",
  k.pos(k.width() / 2, 220),
  k.scale(),
  k.blend(0),
  k.sprite("ship", {
    frame: 0,
  }),
  k.health(5, 10),
  k.anchor("center"),
  k.area({
    isSensor: true,
    shape: new k.Polygon([k.vec2(-8, 7), k.vec2(0, -11), k.vec2(8, 7)]),
  }),
  {
    speed: 200,
    fire: () => {},
  },
  {
    data: "hello world",
    inspect() {
      return "Example of an anonymous component: " + this.data;
    },
  },
]);

hpLabel.updateHP();

ship.onHurt(hpLabel.updateHP);
ship.onHeal(hpLabel.updateHP);

ship.onUpdate(() => {
  // ----- Movement ----- //
  const vec = k.vec2(0, 0);

  if (k.isKeyDown("left")) {
    vec.x -= ship.speed;
  }
  if (k.isKeyDown("right")) {
    vec.x += ship.speed;
  }
  if (k.isKeyDown("up")) {
    vec.y -= ship.speed;
  }
  if (k.isKeyDown("down")) {
    vec.y += ship.speed;
  }

  if (vec.len() > 0) {
    ship.move(vec.unit().scale(ship.speed));
  }

  const N = 16;
  if (ship.pos.x < N) {
    ship.pos.x = N;
  } else if (ship.pos.x > k.width() - N) {
    ship.pos.x = k.width() - N;
  }

  if (ship.pos.y < N) {
    ship.pos.y = N;
  } else if (ship.pos.y > k.height() - N) {
    ship.pos.y = k.height() - N;
  }

  // ----- Sprite ----- //
  let frame = 0; // straight

  if (vec.x > 0) {
    frame = 4; // right
  } else if (vec.x < 0) {
    frame = 8; // left
  }

  ship.frame = frame;

  trail.hidden = vec.y > 0;

  if (vec.y > 0) {
    trail.hidden = true;
  } else if (vec.y < 0) {
    trail.hidden = false;
    if (trail.getCurAnim()?.name !== "long") {
      trail.play("long");
    }
  } else {
    trail.hidden = false;
    if (trail.getCurAnim()?.name !== "short") {
      trail.play("short");
    }
  }
});

// ----- SHIP TRAIL ----- //

k.loadSprite("ship-trail", "sprites/ship-trail.png", {
  sliceX: 5,
  sliceY: 3,
  anims: {
    short: { from: 0, to: 2, loop: true },
    long: { from: 5, to: 9, loop: true },
  },
});

const trail = ship.add([
  "ship__trail",
  k.sprite("ship-trail", {
    anim: "short",
  }),
  k.anchor("center"),
  k.pos(0, 12),
]);
