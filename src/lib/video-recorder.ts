import { k } from "../k";

const mimeTypes = [
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

// Constants I found on the web
// low 0.06,
// medium 0.10,
// high 0.16,
// veryHigh 0.24,
const BITS_PER_PIXEL_PER_FRAME = 0.32;
const FPS = 60;
const MAX_VIDEO_BITS_PER_SECOND = 40_000_000; // ~40 mbps

export const recorder = () => {
  const mimeType = mimeTypes.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );

  const canvasStream = k.canvas.captureStream(FPS);
  const videoTrack = canvasStream.getVideoTracks()[0];

  videoTrack.contentHint = "detail";

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

  recorder.ondataavailable = (e: BlobEvent) => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };

  const cleanup = () => {
    k._k.audio.masterNode.disconnect(audioDest);
    stream.getTracks().forEach((track) => track.stop());
  };

  recorder.onerror = cleanup;

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: recorder.mimeType });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${k.getSceneName() || "kaplay"} (${new Date().toLocaleDateString("en-US")}).webm`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 0);
    cleanup();
  };

  return recorder;
};
