import type { GameObj, ColorComp } from "kaplay";
import { useEffect, useState } from "preact/hooks";
import { cx } from "../lib/cx";

export interface ColorControlProps {
  className?: string;
  obj: GameObj;
}

type ColorChannel = "r" | "g" | "b";

interface ColorSliderProps {
  value: number;
  onChange: (channel: ColorChannel, value: number) => void;
  channel: ColorChannel;
}

const ColorSlider = ({ onChange, value, channel }: ColorSliderProps) => {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange(channel, parseInt(target.value));
  };

  return (
    <input
      className={cx(
        "color-control__slider-input",
        `color-control__slider-input--${channel}`,
      )}
      type="range"
      min="0"
      max="255"
      value={value}
      onInput={handleChange}
    />
  );
};

export const ColorControl = ({ obj }: ColorControlProps) => {
  const object = obj as GameObj<ColorComp>;
  const { r, g, b } = object.color;
  const [color, setColor] = useState({ r, g, b });

  useEffect(() => {
    setColor({ r, g, b });
  }, [r, g, b]);

  const updateColor = (channel: ColorChannel, value: number) => {
    const newColor = { ...color, [channel]: value };
    setColor(newColor);
    object.color[channel] = value;
  };

  return (
    <div class="color-control">
      <div
        class="color-control__swatch"
        style={{ background: `rgb(${color.r} ${color.g} ${color.b})` }}
      />
      <div>
        <ColorSlider value={color.r} onChange={updateColor} channel="r" />
        <ColorSlider value={color.g} onChange={updateColor} channel="g" />
        <ColorSlider value={color.b} onChange={updateColor} channel="b" />
      </div>
      <div>
        rgb({color.r}, {color.g}, {color.b})
      </div>
    </div>
  );
};
