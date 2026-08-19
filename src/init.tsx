import { render } from "preact";
import { Inspector } from "./components/inspector";
import type { KAPLAYCtxType } from "./kaplay";

export interface InspectorOptions {
  initUpdateTimeout?: number;
  initDrawInspectOnHover?: boolean;
  isVisibleOnLoad?: boolean;
  className?: string;
  saveVisibleState?: boolean;
  saveSearch?: boolean;
}

export default function init(k: KAPLAYCtxType, props: InspectorOptions = {}) {
  const {
    className = "",
    initUpdateTimeout = 250,
    isVisibleOnLoad = true,
    initDrawInspectOnHover = true,
    saveVisibleState = false,
    saveSearch = true,
  } = props;

  const appElement = document.createElement("div");
  appElement.className = `k-inspector ${className}`;

  document.body.appendChild(appElement);

  render(
    <Inspector
      k={k}
      initUpdateTimeout={initUpdateTimeout}
      isVisibleOnLoad={isVisibleOnLoad}
      initDrawInspectOnHover={initDrawInspectOnHover}
      saveVisibleState={saveVisibleState}
      saveSearch={saveSearch}
    />,
    appElement,
  );
}
