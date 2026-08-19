import type { GameObj } from "kaplay";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import type { KAPLAYCtxType } from "../kaplay";

interface AppState {
  root: GameObj;
  hoveredObject: GameObj | null;
  updateInterval: number;
  isVisible: boolean;
  isDrawBBoxActive: boolean;
  isMouseInspectActive: boolean;
  searchResults: GameObj[];
  searchInputValue: string;
}

interface AppContextValue extends AppState {
  k: KAPLAYCtxType;
  setAppState: (state: Partial<AppState>) => void;
  setRoot: (obj: GameObj) => void;
  searchQuery: string;
  toggleVisibility: () => void;
  setSearchResults: (results: GameObj[]) => void;
  setSearchInputValue: (value: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppContext.Provider");
  }

  return context;
};
