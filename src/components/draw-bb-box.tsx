import { useApp } from "../lib/app-context";

interface DrawBBoxProps {
  disabled?: boolean;
}

export const DrawBBox = ({ disabled = false }: DrawBBoxProps) => {
  const { isDrawBBoxActive, setDrawBBoxActive } = useApp();

  return (
    <label>
      <input
        disabled={disabled}
        type="checkbox"
        checked={isDrawBBoxActive}
        onChange={() => setDrawBBoxActive(!isDrawBBoxActive)}
      />
      Draw bbox on hover
    </label>
  );
};
