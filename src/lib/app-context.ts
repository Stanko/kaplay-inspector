import type { GameObj } from "kaplay";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { KAPLAYCtxType } from "../kaplay";

export interface AppState {
  root: GameObj;
  inspectObject: GameObj | null;
  updateInterval: number;
  isVisible: boolean;
  isDrawBBoxActive: boolean;
  isMouseInspectActive: boolean;
  searchResults: GameObj[];
  searchInputValue: string;
}

interface AppContextValue extends AppState {
  k: KAPLAYCtxType;
  setRoot: (obj: GameObj) => void;
  searchQuery: string;
  toggleVisibility: () => void;
  setSearchResults: (results: GameObj[]) => void;
  setSearchInputValue: (value: string) => void;
  setUpdateInterval: (value: number) => void;
  setDrawBBoxActive: (value: boolean) => void;
  setMouseInspectActive: (value: boolean) => void;
  setInspectObject: (obj: GameObj | null) => void;
  clearInspectObject: (obj: GameObj) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppContext.Provider");
  }

  return context;
};
