import type { GameObj } from "kaplay";
import type { JSX } from "preact";
import { stringify } from "./stringify";
import { PositionControls } from "../components/position-controls";
import { TextControls } from "../components/text-controls";

export const inspectComps = (obj: GameObj) => {
  const info: Record<string, string> = {};

  for (const [tag, comp] of obj._compStates) {
    info[tag] = comp.inspect?.() ?? null;
  }

  for (const [i, comp] of obj._anonymousCompStates.entries()) {
    if (comp.inspect) {
      info[i] = comp.inspect();
      continue;
    }

    for (const [key, value] of Object.entries(comp)) {
      if (typeof value === "function") {
        info[key] = `${key}: function`;
      } else if (typeof value === "object") {
        info[key] = `${key}: ${stringify(value)}`;
      } else {
        info[key] = `${key}: ${value}`;
      }
    }
  }

  const lines: { tag: string; value?: string | JSX.Element }[] = [];

  for (const tag in info) {
    if (info[tag]) {
      if (tag === "pos") {
        // Custom component for position
        lines.push({
          tag,
          value: <PositionControls obj={obj} />,
        });
      } else {
        lines.push({
          tag,
          value: info[tag].replace(`${tag}: `, ""),
        });
      }
    } else {
      if (tag === "text") {
        // Custom component for text
        lines.push({
          tag,
          value: <TextControls obj={obj} />,
        });
      } else {
        // pushes only the tag (name of the component)
        lines.push({
          tag,
        });
      }
    }
  }

  return lines.sort((a, b) => a.tag.localeCompare(b.tag));
};
