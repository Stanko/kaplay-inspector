import { useEffect, useRef, useState } from "preact/hooks";
import { recorder } from "../../lib/video-recorder";
import { ToolbarButton } from "./toolbar-button";
import { useApp } from "../../lib/app-context";
import { Video } from "lucide-preact";

export const Recorder = () => {
  const { k } = useApp();
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
      <Video />
    </ToolbarButton>
  );
};
