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
import { isPropertyReadOnly } from "./is-property-read-only";

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

const inferPropertyControl = (
  obj: GameObj,
  comp: Comp,
  property: string,
  value: any,
  recursive: boolean,
): JSX.Element | JSX.Element[] | string | string[] | null => {
  if (PROPS_TO_SKIP.includes(property)) {
    return null;
  }

  if (typeof value === "function") {
    return null;
  }

  if (value === null) {
    // TODO maybe just skip it and return null
    return "null";
  }

  // KAPLAY proxies component properties through the game object.
  // Its proxy setter can be present even when the original component property is getter-only.
  if (isPropertyReadOnly(obj, property) || isPropertyReadOnly(comp, property)) {
    return typeof value === "object" ? stringify(value) : String(value);
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
    if (!recursive) {
      return stringify(value);
    }

    const rows = getControls(value, value, false);
    return (
      <div>
        {rows.map((row) => {
          return (
            <div key={`${property}-${row.label}`} class="game-object__comp-row">
              <b>{row.label}</b>
              <div>{row.control}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return value;
};

const getControls = (comp: Comp, obj: GameObj, recursive: boolean = true) => {
  return Object.entries(comp)
    .map(([key, value]) => {
      const control = inferPropertyControl(obj, comp, key, value, recursive);
      if (control) {
        return {
          label: key,
          control,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};

export const inspectComps = (obj: GameObj) => {
  const object = obj as InternalGameObjRaw;

  const data: {
    label: string;
    control?: string | string[] | JSX.Element | JSX.Element[] | null;
  }[] = [];

  for (const [id, comp] of object._compStates) {
    // Explicitely defined components for kaplay native components
    if (componentMap[id]) {
      const CompComponent = componentMap[id];
      data.push({
        label: id,
        control: <CompComponent obj={obj} />,
      });
    } else if (comp.inspect) {
      const value = comp.inspect();
      data.push({
        label: id,
        // Remove component name if it is present in the inspect result.
        // Native Kaplay components are doing this,
        // and because we are displaying the name in the left column already,
        // we don't need to display it again.
        control: value ? value.replace(`${id}: `, "") : "",
      });
    } else {
      const rows = getControls(comp, obj);

      data.push({
        label: id,
        control: rows.map((row) => (
          <div key={row.label} class="game-object__comp-row">
            <b>{row.label}</b>
            <div>{row.control}</div>
          </div>
        )),
      });
    }
  }

  for (const [i, comp] of object._anonymousCompStates.entries()) {
    if (comp.inspect) {
      data.push({
        label: `anonymous ${i}`,
        control: comp.inspect(),
      });
      continue;
    }

    data.push(...getControls(comp, obj));
  }

  return data;
};
