import { render } from "preact";
import { Inspector } from "./components/inspector";
import { setK, type KAPLAYCtxType } from "./k";

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

  // Set kaplay context to be imported directly from components to reduce prop drilling
  setK(k);

  const appElement = document.createElement("div");
  appElement.className = `k-inspector ${className}`;

  document.body.appendChild(appElement);

  render(
    <Inspector
      initUpdateTimeout={initUpdateTimeout}
      isVisibleOnLoad={isVisibleOnLoad}
      initDrawInspectOnHover={initDrawInspectOnHover}
      saveVisibleState={saveVisibleState}
      saveSearch={saveSearch}
    />,
    appElement,
  );
}
