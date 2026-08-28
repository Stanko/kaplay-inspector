import { useCallback, useRef, useState } from "preact/hooks";

export interface ResizeBarProps {}

const MIN = 20;
const MAX = 80;

export const ResizeBar = ({}: ResizeBarProps) => {
  const resizeBarRef = useRef<HTMLButtonElement>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const onPointerDown = useCallback((event: PointerEvent) => {
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      activePointerIdRef.current !== null
    ) {
      return;
    }

    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    resizeBarRef.current?.setPointerCapture(event.pointerId);
    setIsResizing(true);
  }, []);

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isResizing || activePointerIdRef.current !== event.pointerId) {
        return;
      }

      const percent = (1 - event.clientY / window.innerHeight) * 100;
      const value = Math.min(Math.max(MIN, percent), MAX);

      document.body.style.setProperty("--ki-height", `${value.toFixed(1)}vh`);
    },
    [isResizing],
  );

  const onPointerEnd = useCallback((event: PointerEvent) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    if (resizeBarRef.current?.hasPointerCapture(event.pointerId)) {
      resizeBarRef.current.releasePointerCapture(event.pointerId);
    }

    activePointerIdRef.current = null;
    setIsResizing(false);
  }, []);

  return (
    <button
      ref={resizeBarRef}
      type="button"
      class={`ki-resize-bar${isResizing ? " ki-resize-bar--resizing" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
    />
  );
};
