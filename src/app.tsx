import { useCallback, useMemo, useState } from "preact/hooks";
import type { KAPLAYCtxType } from "./kaplay";
import type { GameObj } from "kaplay";
import { AppContext } from "./lib/app-context";
import { Inspector } from "./components/inspector";

export interface AppProps {
  k: KAPLAYCtxType;
}

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

export const App = ({ k }: AppProps) => {
  const [appState, setAppStateRaw] = useState<AppState>({
    // Inspector objects
    root: k.getTreeRoot(),
    hoveredObject: null,
    // Inspector state
    updateInterval: 250,
    isVisible: false,
    isDrawBBoxActive: true,
    isMouseInspectActive: false,
    // Search
    searchResults: [],
    searchInputValue: "",
  });

  const searchQuery = useMemo(
    () => appState.searchInputValue.trim(),
    [appState.searchInputValue],
  );

  const setAppState = useCallback((value: Partial<AppState>) => {
    setAppStateRaw((prevState) => ({ ...prevState, ...value }));
  }, []);

  const toggleVisibility = useCallback(() => {
    setAppState({ isVisible: !appState.isVisible });
  }, [appState.isVisible, setAppState]);

  // Actions
  const setRoot = useCallback((object: GameObj) => {
    setAppState({
      root: object,
      hoveredObject: null,
      searchResults: [],
      searchInputValue: "",
    });
  }, []);
  const contextValue = useMemo(
    () => ({
      k,
      setAppState,
      // Actions
      setRoot,
      toggleVisibility,
      // State
      searchQuery,
      ...appState,
    }),
    [k, setAppState, setRoot, appState],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <Inspector />
    </AppContext.Provider>
  );
};
