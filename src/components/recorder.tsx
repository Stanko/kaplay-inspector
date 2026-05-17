import { useRef } from "preact/hooks";
import { recorder } from "../lib/video-recorder";

export const Recorder = () => {
  const rec = useRef<MediaRecorder | null>(null);

  const start = () => {
    rec.current = recorder();
    rec.current.start();
  };

  const stop = () => {
    if (rec.current) {
      rec.current.stop();
      rec.current = null;
    }
  };

  return (
    <button
      class="ki-btn"
      onClick={() => {
        if (rec.current) {
          stop();
        } else {
          start();
        }
      }}
    >
      {rec.current ? "Stop" : "Record"}
    </button>
  );
};
