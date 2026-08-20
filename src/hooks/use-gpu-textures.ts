import type { Texture } from "kaplay";
import { useApp } from "../lib/app-context";
import { useCallback } from "preact/hooks";

const gpuTextureToDataURL = (texture: Texture) => {
  const { gl } = texture.ctx;
  const framebuffer = gl.createFramebuffer();

  if (!framebuffer) {
    throw new Error("Failed to create framebuffer for GPU texture");
  }

  const pixels = new Uint8ClampedArray(texture.width * texture.height * 4);

  texture.ctx.pushFramebuffer(framebuffer);

  try {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture.glTex,
      0,
    );
    gl.readPixels(
      0,
      0,
      texture.width,
      texture.height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels,
    );
  } finally {
    texture.ctx.popFramebuffer();
    gl.deleteFramebuffer(framebuffer);
  }

  const canvas = document.createElement("canvas");
  canvas.width = texture.width;
  canvas.height = texture.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create canvas context for GPU texture");
  }

  context.putImageData(
    new ImageData(pixels, texture.width, texture.height),
    0,
    0,
  );

  return canvas.toDataURL();
};

export const useGpuTextures = () => {
  const { k } = useApp();

  const getTextures = useCallback(() => {
    const { packer } = k._k.assets;

    packer.syncIfPending();

    const textures = new Set<Texture>();

    Object.values(packer._packers).forEach((packer) => {
      packer?._textures.forEach((texture) => textures.add(texture));
      packer?._big.forEach(({ tex }) => textures.add(tex));
    });

    return [...textures].map((texture) => {
      return gpuTextureToDataURL(texture);
    });
  }, [k]);

  return { getTextures };
};
