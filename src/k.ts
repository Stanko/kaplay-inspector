import kaplay from "kaplay";
import init from "./init";
import "./styles/styles.css";

export const k = kaplay({
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

init(k);
