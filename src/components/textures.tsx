import { useGpuTextures } from "../hooks/use-gpu-textures";
import { ToolbarButton } from "./toolbar-button";

export const Textures = () => {
  const { getTextures } = useGpuTextures();

  return (
    <ToolbarButton onClick={() => getTextures()} tooltip="Display GPU textures">
      T
    </ToolbarButton>
  );
};
