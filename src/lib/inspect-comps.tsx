import type { GameObj, InternalGameObjRaw } from "kaplay";
import type { JSX } from "preact";
import { stringify } from "./stringify";
import { PositionControls } from "../components/position-controls";
import { TextControls } from "../components/text-controls";
import { SpriteControls } from "../components/sprite-controls";
import { Color } from "../components/color-controls";
import { ChildObject } from "../components/child-object";
import { isGameObj } from "./is-game-obj";
import { AnchorControls } from "../components/anchor-controls";

const componentMap: Record<
  string,
  (props: { obj: GameObj }) => JSX.Element | null
> = {
  pos: PositionControls,
  text: TextControls,
  sprite: SpriteControls,
  color: Color,
  anchor: AnchorControls,
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
    } else {
      data.push({
        tag,
        // Commented out on purpose
        // For now, only the name of the component is shown,
        // until I try it out and figure if it would be useful to display the full component state
        // value: stringify(comp),
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
      } else if (isGameObj(value)) {
        data.push({
          tag: key,
          value: <ChildObject obj={value} />,
        });
      } else if (typeof value === "object") {
        data.push({
          tag: key,
          value: value === null ? "null" : stringify(value),
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
