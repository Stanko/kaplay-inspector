import { useApp } from "../../lib/app-context";
import { X } from "lucide-preact";

export const Search = () => {
  const { searchInputValue, setSearchInputValue } = useApp();

  const handleInput = (event: Event) => {
    setSearchInputValue((event.target as HTMLInputElement).value);
  };

  return (
    <div class="ki-search ki-relative">
      <input
        placeholder="Search tags or comps"
        type="text"
        class="ki-search__input"
        onInput={handleInput}
        value={searchInputValue}
      />

      <button
        class="ki-search__clear"
        onClick={() => setSearchInputValue("")}
        aria-label="Clear search"
      >
        <X />
      </button>
    </div>
  );
};
