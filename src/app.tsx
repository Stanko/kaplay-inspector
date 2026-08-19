import { useCallback, useMemo, useState } from "preact/hooks";
import type { KAPLAYCtxType } from "./kaplay";
import type { GameObj } from "kaplay";
import { AppContext, type AppState } from "./lib/app-context";
import { Inspector } from "./components/inspector";

export interface AppProps {
  k: KAPLAYCtxType;
}
export const App = ({ k }: AppProps) => {
  const [appState, setAppStateRaw] = useState<AppState>({
    // Inspector objects
    root: k.getTreeRoot(),
    inspectObject: null,
    // Inspector state
    updateInterval: 250,
    isVisible: true,
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
      inspectObject: null,
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

  const setMouseInspectActive = useCallback(
    (value: boolean) => {
      setAppState({ isMouseInspectActive: value });
    },
    [setAppState],
  );

  const setInspectObject = useCallback((object: GameObj | null) => {
    setAppStateRaw((prevState) => {
      // Don't update state for the same object
      if (prevState.inspectObject === object) {
        return prevState;
      }

      return { ...prevState, inspectObject: object };
    });
  }, []);

  const clearInspectObject = useCallback((object: GameObj) => {
    setAppStateRaw((prevState) =>
      prevState.inspectObject === object
        ? { ...prevState, inspectObject: null }
        : prevState,
    );
  }, []);

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
      setMouseInspectActive,
      setInspectObject,
      clearInspectObject,
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
      setMouseInspectActive,
      setInspectObject,
      clearInspectObject,
      appState,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <Inspector />
    </AppContext.Provider>
  );
};
