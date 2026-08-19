import type { GameObj } from "kaplay";
import { useEffect, useState } from "preact/hooks";
import type { KAPLAYCtxType } from "../kaplay";

export const useObjectSearch = (k: KAPLAYCtxType) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchQuery = searchTerm.trim();

  const [searchResults, setSearchResults] = useState<GameObj[]>([]);
  const [renderIndex, setRenderIndex] = useState(0);

  useEffect(() => {
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;

    const sceneController = k.onSceneLeave(() => {
      setSearchResults([]);

      // Kaplay creates the next scene after firing sceneLeave and clearing the current scene events.
      // Wait until that finishes before subscribing a new live query to the new scene.
      refreshTimeout = setTimeout(() => {
        setRenderIndex((index) => index + 1);
      }, 0);
    });

    return () => {
      sceneController.cancel();
      clearTimeout(refreshTimeout);
    };
  }, [k, renderIndex]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(() => {
      setSearchResults(
        k.get(searchQuery, { recursive: true, liveUpdate: true }),
      );
    }, 250);

    return () => clearTimeout(searchTimeout);
  }, [k, renderIndex, searchQuery]);

  return {
    searchResults,
    searchQuery,
    searchTerm,
    setSearchTerm,
  };
};
