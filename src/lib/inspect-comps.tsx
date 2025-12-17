import type { GameObj, InternalGameObjRaw } from "kaplay";
import type { JSX } from "preact";
import { stringify } from "./stringify";
import { PositionControls } from "../components/position-controls";
import { TextControls } from "../components/text-controls";
import { Sprite } from "../components/sprite";

const componentMap: Record<
  string,
  (props: { obj: GameObj }) => JSX.Element | null
> = {
  pos: PositionControls,
  text: TextControls,
  sprite: Sprite,
};

export const inspectComps = (obj: GameObj) => {
  const object = obj as InternalGameObjRaw;

  const data: { tag: string; value?: string | JSX.Element | null }[] = [];

  for (const [tag, comp] of object._compStates) {
    if (componentMap[tag]) {
      const CompComponent = componentMap[tag];
      data.push({
        tag,
        value: <CompComponent obj={obj} />,
      });
    } else if (comp.inspect) {
      const value = comp.inspect();
      data.push({
        tag,
        // Remove component name if it is present in the inspect result.
        // Native Kaplay components are doing this,
        // and because we are displaying the name in the left column already,
        // we don't need to display it again.
        value: value ? value.replace(`${tag}: `, "") : "",
      });
    }
  }

  for (const [i, comp] of object._anonymousCompStates.entries()) {
    if (comp.inspect) {
      data.push({
        tag: `anonymous ${i}`,
        value: comp.inspect(),
      });
      continue;
    }

    for (const [key, value] of Object.entries(comp)) {
      if (typeof value === "function") {
        data.push({
          tag: key,
          value: "function",
        });
      } else if (typeof value === "object") {
        data.push({
          tag: key,
          value: stringify(value),
        });
      } else {
        data.push({
          tag: key,
          value,
        });
      }
    }
  }

  return data.sort((a, b) => a.tag.localeCompare(b.tag));
};
