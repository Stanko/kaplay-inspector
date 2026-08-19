import type { GameObj } from "kaplay";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { KAPLAYCtxType } from "../kaplay";

interface InspectorContextValue {
  k: KAPLAYCtxType;
  setRoot: (obj: GameObj) => void;
  setInspectObject: (obj: GameObj | null) => void;
  clearInspectObject: (obj: GameObj) => void;
}

export const InspectorContext = createContext<InspectorContextValue | null>(
  null,
);

export const useInspector = () => {
  const context = useContext(InspectorContext);

  if (!context) {
    throw new Error(
      "useInspector must be used inside InspectorContext.Provider",
    );
  }

  return context;
};
