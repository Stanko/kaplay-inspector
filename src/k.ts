import kaplay from "kaplay";

export type KAPLAYCtxType = ReturnType<typeof kaplay>;

export let k: KAPLAYCtxType;
export const setK = (ctx: KAPLAYCtxType) => {
  k = ctx;
};
