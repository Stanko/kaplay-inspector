import type { GameObj } from "kaplay";
import { GameObject } from "./game-object";

export interface SearchResultsProps {
  results: GameObj[];
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      {results.map((result) => {
        return (
          <GameObject
            className="game-object--root"
            obj={result}
            isExpanded={results.length === 1}
          />
        );
      })}{" "}
    </div>
  );
};
