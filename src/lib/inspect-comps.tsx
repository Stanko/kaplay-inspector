import type { GameObj, InternalGameObjRaw } from "kaplay";
import type { JSX } from "preact";
import { stringify } from "./stringify";
import { TextControl } from "../components/text-control";
import { SpriteControl } from "../components/sprite-control";
import { ColorControl } from "../components/color-control";
import { ChildObject } from "../components/child-object";
import { isGameObj } from "./is-game-obj";
import { AnchorControl } from "../components/anchor-control";
import { HpControl } from "../components/hp-control";
import { NumberControl } from "../components/number-control";
import { VectorControl } from "../components/vector-control";
import { BlendControl } from "../components/blend-control";

const componentMap: Record<
  string,
  (props: { obj: GameObj }) => JSX.Element | null
> = {
  text: TextControl,
  sprite: SpriteControl,
  color: ColorControl,
  anchor: AnchorControl,
  health: HpControl,
  blend: BlendControl,
  // Vectors
  pos: ({ obj }) => <VectorControl obj={obj} property="pos" />,
  scale: ({ obj }) => <VectorControl obj={obj} property="scale" step={0.1} />,
  skew: ({ obj }) => <VectorControl obj={obj} property="skew" step={5} />,
  // Numbers
  opacity: ({ obj }) => (
    <NumberControl obj={obj} property="opacity" step={0.1} />
  ),
  rotate: ({ obj }) => <NumberControl obj={obj} property="angle" step={5} />,
  z: ({ obj }) => <NumberControl obj={obj} property="z" />,
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
        // value: <pre>{stringify(comp)}</pre>,
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
        if (typeof value === "number") {
          data.push({
            tag: key,
            value: <NumberControl obj={obj} property={key} />,
          });
        } else {
          data.push({
            tag: key,
            value,
          });
        }
      }
    }
  }

  return data.sort((a, b) => a.tag.localeCompare(b.tag));
};
