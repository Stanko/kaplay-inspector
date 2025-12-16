import type { KAPLAYCtx } from "kaplay";
import { render } from "preact";
import { Inspector } from "./components/inspector";

export interface InspectorOptions {
  updateTimeout?: number;
}
export default function init(k: KAPLAYCtx, props: InspectorOptions = {}) {
  const appElement = document.createElement("div");
  appElement.className = "exp";

  document.body.appendChild(appElement);

  render(<Inspector k={k} {...props} />, appElement);
}
