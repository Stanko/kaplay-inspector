import { useEffect, useState } from "preact/hooks";
import { useApp } from "../lib/app-context";

export const Search = () => {
  const {
    k,
    searchInputValue,
    setSearchInputValue,
    searchQuery,
    setSearchResults,
  } = useApp();
  const [sceneChangeCount, setSceneChangeCount] = useState(0);

  useEffect(() => {
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;

    const sceneController = k.onSceneLeave(() => {
      setSearchResults([]);

      // Kaplay creates the next scene after firing sceneLeave and clearing the current scene events.
      // Wait until that finishes before subscribing a new live query to the new scene.
      refreshTimeout = setTimeout(() => {
        setSceneChangeCount((index) => index + 1);
      }, 0);
    });

    return () => {
      sceneController.cancel();
      clearTimeout(refreshTimeout);
    };
  }, [k, sceneChangeCount]);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(() => {
      setSearchResults(
        k.get(searchQuery, {
          recursive: true,
          liveUpdate: true,
        }),
      );
    }, 250);

    return () => clearTimeout(searchTimeout);
  }, [k, searchQuery, setSearchResults, sceneChangeCount]);

  const handleInput = (event: Event) => {
    setSearchInputValue((event.target as HTMLInputElement).value);
  };

  return (
    <div class="k-inspector__search">
      <input
        placeholder="Search tags or comps"
        type="text"
        class="ki-input k-inspector__search-input"
        onInput={handleInput}
        value={searchInputValue}
      />

      <button
        class="k-inspector__search-clear"
        onClick={() => setSearchInputValue("")}
        aria-label="Clear search"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M 1 1 L 15 15 M 1 15 L 15 1" />
        </svg>
      </button>
    </div>
  );
};
