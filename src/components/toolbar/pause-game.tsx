import { PauseCircle, PlayCircle } from "lucide-preact";
import { useApp } from "../../lib/app-context";
import { useObjectBoolean } from "../controls/boolean-control";
import { IconButton } from "../inputs/icon-button";

export const PauseGame = () => {
  const { k } = useApp();
  const paused = useObjectBoolean(k.getTreeRoot(), "paused");

  return (
    <IconButton
      onClick={() => paused.onChange(!paused.checked)}
      tooltip={paused.checked ? "Resume Game" : "Pause Game"}
    >
      {paused.checked ? <PlayCircle /> : <PauseCircle />}
    </IconButton>
  );
};
