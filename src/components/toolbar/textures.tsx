import { Image, RefreshCcw } from "lucide-preact";
import { useCallback, useId, useState } from "preact/hooks";
import { useGpuTextures } from "../../hooks/use-gpu-textures";
import { IconButton } from "../inputs/icon-button";

const openTexture = (dataUrl: string) => {
  const newTab = window.open("", "_blank");

  if (!newTab) {
    return;
  }

  newTab.opener = null;
  newTab.document.title = "Kaplay GPU Texture";

  const image = newTab.document.createElement("img");
  image.src = dataUrl;
  image.style.maxWidth = "100%";
  newTab.document.body.append(image);
};

export const Textures = () => {
  const dropdownId = useId();
  const { getTextures } = useGpuTextures();
  const [textures, setTextures] = useState<string[]>([]);

  const handleClick = useCallback(() => {
    if (!textures.length) {
      setTextures(getTextures());
    }
  }, [getTextures, textures]);

  const handleRefresh = useCallback(() => {
    setTextures(getTextures());
  }, [getTextures]);

  return (
    <>
      <IconButton
        popovertarget={dropdownId}
        aria-haspopup="true"
        tooltip={"Display GPU Textures"}
        onClick={handleClick}
      >
        <Image />
      </IconButton>

      <div
        id={dropdownId}
        popover="auto"
        class="ki-dropdown ki-dropdown--textures"
      >
        <div class="ki-textures">
          {textures.map((texture, index) => (
            <button
              type="button"
              key={index}
              title="Open texture in new tab"
              onClick={() => openTexture(texture)}
            >
              <img class="ki-texture" src={texture} alt="" />
            </button>
          ))}
        </div>
        <button
          type="button"
          class="ki-btn ki-flex ki-textures__refresh"
          onClick={handleRefresh}
        >
          <RefreshCcw />
          Refresh
        </button>
      </div>
    </>
  );
};
