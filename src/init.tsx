import { render } from "preact";
import { Inspector } from "./components/inspector";
import type { KAPLAYCtxType } from "./kaplay";

export interface InspectorOptions {
  /** CSS class to add to the root element */
  className?: string;
  /** is inspector visible on load, default: true */
  isVisibleOnLoad?: boolean;
  /** default update time in milliseconds, default: 250 */
  initUpdateTimeout?: number;
  /** should bounding box, area and anchor be drawn on object hover, default: true */
  initDrawInspectOnHover?: boolean;
  /** persist inspector visibility between page loads, default: false */
  saveVisibleState?: boolean;
  /** persist the search input between page loads, default: true */
  saveSearch?: boolean;
  /** interface theme, default: "system" */
  theme?: "light" | "dark" | "system";
}

export default function init(k: KAPLAYCtxType, props: InspectorOptions = {}) {
  const {
    className = "",
    initUpdateTimeout = 250,
    isVisibleOnLoad = true,
    initDrawInspectOnHover = true,
    saveVisibleState = false,
    saveSearch = true,
    theme = "system",
  } = props;

  const appElement = document.createElement("div");
  appElement.className = `k-inspector k-inspector--${theme} ${className}`;

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
