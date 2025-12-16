import { k } from "./k";
import "./styles/demo.css";

// ----- INIT ----- //

k.loadRoot("./");

k.loadFont("nope8", "fonts/Nope8.woff", {
  filter: "nearest",
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
  k.anchor("center"),
  k.pos(k.randi(k.width()), k.randi(k.height())),
]);

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
  anims: {
    straight: { frames: [0], loop: false },
    right: { frames: [4], loop: false },
    left: { frames: [8], loop: false },
  },
});

const ship = k.add([
  "ship",
  k.pos(k.width() / 2, 220),
  k.sprite("ship"),
  k.anchor("center"),
  {
    speed: 200,
  },
]);

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

  ship.move(vec.unit().scale(ship.speed));

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

ship.add([
  "ship__trail",
  k.sprite("ship-trail", {
    anim: "short",
  }),
  k.anchor("center"),
  k.pos(0, 12),
]);
