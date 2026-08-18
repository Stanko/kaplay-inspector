import type { Comp, GameObj, InternalGameObjRaw } from "kaplay";
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
import { BooleanControl } from "../components/boolean-comp";

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

const PROPS_TO_SKIP = ["id", "require"];

const inferPropertyControl = (obj: GameObj, property: string, value: any) => {
  if (PROPS_TO_SKIP.includes(property)) {
    return null;
  }

  if (property === null) {
    return "null";
  }

  if (typeof value === "function") {
    // TODO try adding a button to invoke the function
    // return "function";
    return null;
  }

  if (typeof value === "string") {
    return <TextControl obj={obj} property={property} />;
  }

  if (typeof value === "boolean") {
    return <BooleanControl obj={obj} property={property} />;
  }

  if (typeof value === "number") {
    return <NumberControl obj={obj} property={property} />;
  }

  if (isGameObj(value)) {
    return <ChildObject obj={value} />;
  }

  if (
    // TODO write better check for vectors
    typeof value === "object" &&
    typeof value.x === "number" &&
    typeof value.y === "number"
  ) {
    return <VectorControl obj={obj} property={property} inPlace />;
  }

  if (typeof value === "object") {
    return stringify(value);
  }

  return value;
};

const getControls = (comp: Comp, obj: GameObj) => {
  return Object.entries(comp)
    .map(([key, value]) => {
      const control = inferPropertyControl(obj, key, value);
      if (control) {
        return {
          tag: key,
          value: control,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};

export const inspectComps = (obj: GameObj) => {
  const object = obj as InternalGameObjRaw;

  const data: { tag: string; value?: string | JSX.Element | null }[] = [];

  for (const [tag, comp] of object._compStates) {
    // Explicitely defined components for kaplay native components
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
      const controls = getControls(comp, obj);

      if (controls.length === 0) {
        continue;
      }

      if (controls.length === 1) {
        // When there is only one property, display it using the component name as the label
        data.push(controls[0]);
      } else {
        // If there are more, display the component name as a title and list each property
        data.push({ tag });

        for (const control of controls) {
          data.push({
            tag: `- ${control.tag}`,
            value: control.value,
          });
        }
      }
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

    data.push(...getControls(comp, obj));
  }

  return data;
};
