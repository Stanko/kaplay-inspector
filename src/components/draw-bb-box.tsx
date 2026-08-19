import { SquareDashed } from "lucide-preact";
import { useApp } from "../lib/app-context";

export const DrawBBox = () => {
  const { isDrawBBoxActive, isMouseInspectActive, setDrawBBoxActive } =
    useApp();

  return (
    <label>
      <input
        disabled={isMouseInspectActive}
        type="checkbox"
        checked={isDrawBBoxActive}
        onChange={() => setDrawBBoxActive(!isDrawBBoxActive)}
      />
      <SquareDashed />
    </label>
  );
};
