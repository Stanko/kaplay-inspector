import type { GameObj } from "kaplay";
import { GameObject } from "./game-object";

export interface SearchResultsProps {
  className?: string;
  results: GameObj[];
  setRenderRoot: (obj: GameObj) => void;
  shouldDrawInspect: boolean;
}

export const SearchResults = ({
  results,
  setRenderRoot,
  shouldDrawInspect,
}: SearchResultsProps) => {
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
            setRenderRoot={setRenderRoot}
            shouldDrawInspect={shouldDrawInspect}
            // isExpanded
            // isRenderRoot
          />
        );
      })}{" "}
    </div>
  );
};
