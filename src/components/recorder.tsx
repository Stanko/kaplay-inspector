import { useEffect, useRef, useState } from "preact/hooks";
import { recorder } from "../lib/video-recorder";
import { useInspector } from "./inspector-context";

export const Recorder = () => {
  const { k } = useInspector();
  const rec = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const start = () => {
    rec.current = recorder(k);
    rec.current.start();
    setIsRecording(true);
  };

  const stop = () => {
    if (rec.current) {
      setIsRecording(false);

      if (rec.current && rec.current.state !== "inactive") {
        rec.current.stop();
      }

      rec.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return (
    <button
      class="ki-btn"
      onClick={() => {
        if (isRecording) {
          stop();
        } else {
          start();
        }
      }}
    >
      {isRecording ? "Stop" : "Record"}
    </button>
  );
};
