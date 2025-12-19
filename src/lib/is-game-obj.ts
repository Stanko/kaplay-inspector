import type { GameObj } from "kaplay";

export const isGameObj = (obj: any): obj is GameObj => {
  // I selected isAncestorOf as a property to check for
  // it is really unlikely that a non-game object would have this property
  return typeof obj === "object" && obj !== null && "isAncestorOf" in obj;
};
