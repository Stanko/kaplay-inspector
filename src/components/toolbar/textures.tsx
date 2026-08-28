import { Image, RefreshCcw } from "lucide-preact";
import { useCallback, useId, useState } from "preact/hooks";
import { useGpuTextures } from "../../hooks/use-gpu-textures";
import { IconButton } from "../inputs/toolbar-button";

const openTexture = (dataUrl: string) => {
  const [encodedData] = dataUrl.split(",", 2);
  const mimeType = "image/png";
  const bytes = Uint8Array.from(atob(encodedData), (character) =>
    character.charCodeAt(0),
  );
  const objectUrl = URL.createObjectURL(new Blob([bytes], { type: mimeType }));

  window.open(objectUrl, "_blank", "noopener,noreferrer");

  // Give the new tab enough time to load the object URL before releasing it.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5_000);
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
