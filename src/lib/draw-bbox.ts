import type { Anchor, GameObj } from "kaplay";
import type { KAPLAYCtxType } from "../kaplay";

const anchorMap: Record<Anchor, [x: number, y: number]> = {
  topleft: [-1, -1],
  top: [0, -1],
  topright: [1, -1],
  left: [-1, 0],
  center: [0, 0],
  right: [1, 0],
  botleft: [-1, 1],
  bot: [0, 1],
  botright: [1, 1],
};

export const drawBoundingBox = (obj: GameObj, k: KAPLAYCtxType) => {
  if (obj.renderArea) {
    const localArea = obj.renderArea();
    const transform = obj.transform.clone();
    let anchor = obj.anchor || "topleft";

    if (localArea && obj.anchor !== "topleft") {
      if (typeof anchor === "string") {
        const coords = anchorMap[anchor as Anchor];
        anchor = new k.Vec2(coords[0], coords[1]);
      }

      const offset = anchor
        .add(1, 1)
        .scale(-0.5 * localArea.width, -0.5 * localArea.height);

      transform.translateSelfV(offset);
    }

    const worldArea = localArea.transform(transform);
    const worldBBox = worldArea.bbox();

    k.drawRect({
      pos: worldBBox.pos,
      width: worldBBox.width,
      height: worldBBox.height,
      fill: false,
      outline: {
        width: 1,
        color: k.GREEN,
        opacity: 0.75,
      },
    });
  }

  obj.children.forEach((child) => {
    if (!child.hidden) {
      drawBoundingBox(child, k);
    }
  });
};
