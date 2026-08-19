import { Image } from "lucide-preact";
import { useGpuTextures } from "../../hooks/use-gpu-textures";
import { ToolbarButton } from "../inputs/toolbar-button";

export const Textures = () => {
  const { getTextures } = useGpuTextures();

  return (
    <ToolbarButton onClick={() => getTextures()} tooltip="Display GPU Textures">
      <Image />
    </ToolbarButton>
  );
};
