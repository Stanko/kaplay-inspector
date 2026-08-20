import type { GameObj } from "kaplay";
import { GameObject } from "./game-object";

export interface SearchResultsProps {
  results: GameObj[];
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) {
    return <div class="ki-search__no-results">No results found.</div>;
  }

  return (
    <div>
      {results.map((result) => {
        return (
          <GameObject
            key={result.id}
            className="ki-obj--root"
            obj={result}
            isExpanded={results.length === 1}
          />
        );
      })}{" "}
    </div>
  );
};
