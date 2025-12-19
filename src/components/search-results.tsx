import type { GameObj } from "kaplay";
import { GameObject } from "./game-object";
import type { KAPLAYCtxType } from "../init";

export interface SearchResultsProps {
  k: KAPLAYCtxType;
  className?: string;
  results: GameObj[];
  setRenderRoot: (obj: GameObj) => void;
  shouldDrawInspect: boolean;
}

export const SearchResults = ({
  k,
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
            k={k}
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
