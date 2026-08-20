import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import type { KAPLAYCtxType } from "./kaplay";
import type { GameObj } from "kaplay";
import {
  AppContext,
  type AppState,
  type InspectObjectController,
} from "./lib/app-context";
import { Inspector } from "./components/inspector";

export interface AppProps {
  k: KAPLAYCtxType;
}

const KEYS_TO_SAVE: (keyof AppState)[] = [
  "updateInterval",
  "isVisible",
  "isDrawBBoxActive",
  "searchInputValue",
];

const LS_APP_STATE = "ki__app-state";

const save = (appState: AppState) => {
  const data: Record<string, any> = {};

  KEYS_TO_SAVE.forEach((key) => {
    data[key] = appState[key];
  });

  localStorage.setItem(LS_APP_STATE, JSON.stringify(data));
};

const load = () => {
  try {
    const savedState = localStorage.getItem(LS_APP_STATE);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {};
  } catch {
    localStorage.removeItem(LS_APP_STATE);
    return {};
  }
};

export const App = ({ k }: AppProps) => {
  const inspectObjectRef = useRef<GameObj | null>(null);
  const [appState, setAppStateRaw] = useState<AppState>({
    // Inspector objects
    root: k.getTreeRoot(),
    // Inspector state
    updateInterval: 250,
    isVisible: true,
    isDrawBBoxActive: true,
    isMouseInspectActive: false,
    // Search
    searchInputValue: "",
    ...load(),
  });

  const inspectObject = useMemo<InspectObjectController>(
    () => ({
      get: () => inspectObjectRef.current,
      set: (object) => {
        inspectObjectRef.current = object;
      },
      clear: (object) => {
        if (object === undefined || inspectObjectRef.current === object) {
          inspectObjectRef.current = null;
        }
      },
    }),
    [],
  );

  const searchQuery = useMemo(
    () => appState.searchInputValue.trim(),
    [appState.searchInputValue],
  );

  const setAppState = useCallback((value: Partial<AppState>) => {
    setAppStateRaw((prevState) => {
      const newState = { ...prevState, ...value };

      if (
        Object.keys(value).some((key) =>
          KEYS_TO_SAVE.includes(key as keyof AppState),
        )
      ) {
        save(newState);
      }

      return newState;
    });
  }, []);

  // Actions
  const toggleVisibility = useCallback(() => {
    setAppState({ isVisible: !appState.isVisible });
  }, [appState.isVisible, setAppState]);

  const setRoot = useCallback(
    (object: GameObj) => {
      // This is not the cleanest way to get the dom element,
      // but it is the simplest and it is safe and reliable
      const element = document.querySelector(".ki-objects");
      if (element) {
        element.scrollTo(0, 0);
      }

      inspectObject.clear();
      setAppState({
        root: object,
        searchInputValue: "",
      });
    },
    [inspectObject, setAppState],
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

  const contextValue = useMemo(
    () => ({
      k,
      // Actions
      setRoot,
      toggleVisibility,
      setSearchInputValue,
      setUpdateInterval,
      setDrawBBoxActive,
      setMouseInspectActive,
      // Inspect object controller
      inspectObject,
      // State
      searchQuery,
      ...appState,
    }),
    [
      k,
      inspectObject,
      setRoot,
      toggleVisibility,
      setSearchInputValue,
      setUpdateInterval,
      setDrawBBoxActive,
      setMouseInspectActive,
      appState,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>
      <Inspector />
    </AppContext.Provider>
  );
};
