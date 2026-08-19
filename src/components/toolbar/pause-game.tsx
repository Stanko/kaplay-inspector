import { PauseCircle, PlayCircle } from "lucide-preact";
import { useApp } from "../../lib/app-context";
import { useObjectBoolean } from "../controls/boolean-control";
import { ToolbarButton } from "../inputs/toolbar-button";

export const PauseGame = () => {
  const { k } = useApp();
  const paused = useObjectBoolean(k.getTreeRoot(), "paused");

  return (
    <ToolbarButton
      onClick={() => paused.onChange(!paused.checked)}
      tooltip={paused.checked ? "Play Game" : "Pause Game"}
    >
      {paused.checked ? <PlayCircle /> : <PauseCircle />}
    </ToolbarButton>
  );
};
