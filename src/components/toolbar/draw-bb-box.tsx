import { VectorSquare } from "lucide-preact";
import { useApp } from "../../lib/app-context";
import { ToolbarButtonToggle } from "../inputs/toolbar-toggle-button";

export const DrawBBox = () => {
  const { isDrawBBoxActive, isMouseInspectActive, setDrawBBoxActive } =
    useApp();

  return (
    <ToolbarButtonToggle
      tooltip="Draw Bounding Box"
      disabled={isMouseInspectActive}
      checked={isDrawBBoxActive}
      onChange={setDrawBBoxActive}
    >
      <VectorSquare />
    </ToolbarButtonToggle>
  );
};
