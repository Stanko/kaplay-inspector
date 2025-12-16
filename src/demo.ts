import kaplay from "kaplay";
import init from "./init";
import "./styles/styles.css";

export const k = kaplay({
  global: false,
  width: 16 * 30, // 480
  height: 9 * 30, // 270
  pixelDensity: 1,
  debugKey: "d",
  scale: 2,
  background: "black",
  texFilter: "nearest",
  debug: true,
  crisp: true,
});

init(k);
