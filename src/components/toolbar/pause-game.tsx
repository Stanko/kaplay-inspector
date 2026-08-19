import { Pause, Play } from "lucide-preact";
import { useApp } from "../../lib/app-context";
import { useObjectBoolean } from "../controls/boolean-control";

export const PauseGame = () => {
  const { k } = useApp();
  const paused = useObjectBoolean(k.getTreeRoot(), "paused");

  return (
    <button class="ki-btn" onClick={() => paused.onChange(!paused.checked)}>
      {paused.checked ? <Play /> : <Pause />}
    </button>
  );
};
