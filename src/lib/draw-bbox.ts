import type { GameObj, KAPLAYCtx, Rect } from "kaplay";

export const drawBoundingBox = (obj: GameObj, k: KAPLAYCtx) => {
  // TODO handle a case when anchor is a vec2
  const anchor = obj.anchor || "topleft";

  if (obj.renderArea && obj.has("anchor")) {
    const offset = k.vec2(0);
    const rect = obj.renderArea().bbox() as Rect;

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
