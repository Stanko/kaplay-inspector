import type { AnchorComp, GameObj, Rect } from "kaplay";
import type { KAPLAYCtxType } from "../init";

export const drawBoundingBox = (obj: GameObj, k: KAPLAYCtxType) => {
  if (obj.renderArea) {
    const rect = obj.renderArea().bbox() as Rect;

    const anchor = (obj as GameObj<AnchorComp>).anchor || "topleft";
    const offset = k.vec2(0);

    if (typeof anchor === "string") {
      if (anchor.includes("left")) {
        offset.x = 0;
      } else if (anchor.includes("right")) {
        offset.x = rect.width;
      } else {
        offset.x = rect.width / 2;
      }

      if (anchor.includes("top")) {
        offset.y = 0;
      } else if (anchor.includes("bot")) {
        offset.y = rect.height;
      } else {
        offset.y = rect.height / 2;
      }
    } else {
      offset.x = (anchor.x * rect.width + 1) / 2 + rect.width / 2;
      offset.y = (anchor.y * rect.height + 1) / 2 + rect.height / 2;
    }

    rect.pos = rect.pos.sub(offset);

    k.drawRect({
      ...rect,
      fill: false,
      outline: {
        width: 1,
        color: k.GREEN,
        opacity: 0.75,
      },
    });
  }
};
