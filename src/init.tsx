import { render } from "preact";
import type { KAPLAYCtxType } from "./kaplay";
import { App } from "./app";

export interface InspectorOptions {
  /** CSS class to add to the root element */
  className?: string;
  /** interface theme, default: "system" */
  theme?: "light" | "dark" | "system";
}

export default function init(k: KAPLAYCtxType, props: InspectorOptions = {}) {
  const { className = "", theme = "system" } = props;

  const appElement = document.createElement("div");
  appElement.className = `k-inspector k-inspector--${theme} ${className}`;

  document.body.appendChild(appElement);

  render(<App k={k} />, appElement);
}
