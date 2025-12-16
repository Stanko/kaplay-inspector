import type { KAPLAYCtx } from "kaplay";
import { render } from "preact";
import { Inspector } from "./components/inspector";

export interface InspectorOptions {
  updateTimeout?: number;
  isVisibleOnLoad?: boolean;
  className?: string;
}
export default function init(k: KAPLAYCtx, props: InspectorOptions = {}) {
  const {
    //
    className = "",
    updateTimeout = 100,
    isVisibleOnLoad = true,
  } = props;

  const appElement = document.createElement("div");
  appElement.className = `k-inspector ${className}`;

  document.body.appendChild(appElement);

  render(
    <Inspector
      k={k}
      updateTimeout={updateTimeout}
      isVisibleOnLoad={isVisibleOnLoad}
    />,
    appElement,
  );
}
