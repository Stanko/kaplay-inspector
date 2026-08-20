import { useApp } from "../../lib/app-context";
import { X } from "lucide-preact";

export const Search = () => {
  const { searchInputValue, setSearchInputValue } = useApp();

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
        <X />
      </button>
    </div>
  );
};
