import { useApp } from "../lib/app-context";

export const DrawBBox = () => {
  const {
    isDrawBBoxActive,
    isMouseInspectActive,
    setDrawBBoxActive,
  } = useApp();

  return (
    <label>
      <input
        disabled={isMouseInspectActive}
        type="checkbox"
        checked={isDrawBBoxActive}
        onChange={() => setDrawBBoxActive(!isDrawBBoxActive)}
      />
      Draw bbox on hover
    </label>
  );
};
