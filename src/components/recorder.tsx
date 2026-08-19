import { useEffect, useRef, useState } from "preact/hooks";
import { recorder } from "../lib/video-recorder";
import { useInspector } from "./inspector-context";
import { ToolbarButton } from "./toolbar-button";

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
    <ToolbarButton
      tooltip={isRecording ? "Stop Recording" : "Record Video"}
      onClick={() => {
        if (isRecording) {
          stop();
        } else {
          start();
        }
      }}
    >
      R
    </ToolbarButton>
  );
};
