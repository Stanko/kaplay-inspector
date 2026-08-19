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

  // Actions
  const toggleVisibility = useCallback(() => {
    setAppState({ isVisible: !appState.isVisible });
  }, [appState.isVisible, setAppState]);

  const setRoot = useCallback((object: GameObj) => {
    setAppState({
      root: object,
      hoveredObject: null,
      searchResults: [],
      searchInputValue: "",
    });
  }, []);

  const setSearchResults = useCallback(
    (results: GameObj[]) => {
      setAppState({ searchResults: results });
    },
    [setAppState],
  );

  const setSearchInputValue = useCallback(
    (value: string) => {
      setAppState({ searchInputValue: value });
    },
    [setAppState],
  );

  const setUpdateInterval = useCallback(
    (value: number) => {
      setAppState({ updateInterval: value });
    },
    [setAppState],
  );

  const setDrawBBoxActive = useCallback(
    (value: boolean) => {
      setAppState({ isDrawBBoxActive: value });
    },
    [setAppState],
  );

  const contextValue = useMemo(
    () => ({
      k,
      // Actions
      setRoot,
      toggleVisibility,
      setSearchResults,
      setSearchInputValue,
      setUpdateInterval,
      setDrawBBoxActive,
      // State
      searchQuery,
      ...appState,
    }),
    [
      k,
      setRoot,
      toggleVisibility,
      setSearchResults,
      setSearchInputValue,
      setUpdateInterval,
      setDrawBBoxActive,
      appState,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <Inspector />
    </AppContext.Provider>
  );
};
