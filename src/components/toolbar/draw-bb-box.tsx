import { VectorSquare } from "lucide-preact";
import { useApp } from "../../lib/app-context";
import { IconToggleButton } from "../inputs/icon-toggle-button";

export const DrawBBox = () => {
  const { isDrawBBoxActive, isMouseInspectActive, setDrawBBoxActive } =
    useApp();

  return (
    <IconToggleButton
      tooltip="Draw Bounding Box"
      disabled={isMouseInspectActive}
      checked={isDrawBBoxActive}
      onChange={setDrawBBoxActive}
    >
      <VectorSquare />
    </IconToggleButton>
  );
};
