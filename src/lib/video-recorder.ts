import { k } from "../k";

const mimeTypes = [
  "video/webm; codecs=vp9,opus",
  "video/webm; codecs=vp8,opus",
  "video/webm",
];

const mimeType = mimeTypes.find(MediaRecorder.isTypeSupported);

// Constants I found on the web
// low 0.06,
// medium 0.10,
// high 0.16,
// veryHigh 0.24,
const BITS_PER_PIXEL_PER_FRAME = 0.16;
const FPS = 60;
const MAX_VIDEO_BITS_PER_SECOND = 40_000_000; // ~40 mbps

export const recorder = () => {
  const canvasStream = k.canvas.captureStream(60);
  const videoBitsPerSecond = Math.round(
    k.canvas.width * k.canvas.height * FPS * BITS_PER_PIXEL_PER_FRAME,
  );

  const audioDest = k.audioCtx.createMediaStreamDestination();

  k._k.audio.masterNode.connect(audioDest);

  const stream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks(),
  ]);

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: Math.min(MAX_VIDEO_BITS_PER_SECOND, videoBitsPerSecond),
  });

  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${k.getSceneName() || "kaplay"} (${new Date().toLocaleDateString("en-US")}).webm`;
    a.click();

    k._k.audio.masterNode.disconnect(audioDest);
    canvasStream.getTracks().forEach((t) => t.stop());
  };

  return recorder;
};
