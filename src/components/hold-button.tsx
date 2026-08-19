import { useCallback, useEffect, useRef } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

export type HoldButtonProps = {
  children?: JSX.Element | string | number;
  className?: string;
  onClickAndHold: () => void;
  onHoldEnd?: () => void;
  interval?: number;
  startRepeatingDelay?: number;
};

export const HoldButton = ({
  children,
  className,
  onClickAndHold,
  interval = 50,
  startRepeatingDelay = 200,
  onHoldEnd,
}: HoldButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const pointerIdRef = useRef<number>(0);
  const onClickAndHoldRef = useRef(onClickAndHold);
  const onHoldEndRef = useRef(onHoldEnd);

  const startTimer = useCallback(() => {
    // Trigger once immediately
    onClickAndHoldRef.current();

    // Wait before repeating
    timerRef.current = setTimeout(() => {
      // Repeat
      onClickAndHoldRef.current();

      timerRef.current = setInterval(() => {
        onClickAndHoldRef.current();
      }, interval);
    }, startRepeatingDelay);
  }, [interval, startRepeatingDelay]);

  const stopTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    clearInterval(timerRef.current);

    if (buttonRef.current?.hasPointerCapture(pointerIdRef.current)) {
      buttonRef.current.releasePointerCapture(pointerIdRef.current);
    }
  }, []);

  // Clear timer on unmount
  useEffect(() => stopTimer, [stopTimer]);

  // Keep references updated to the latest callbacks
  // This ensures the interval always calls the latest version
  useEffect(() => {
    onClickAndHoldRef.current = onClickAndHold;
  }, [onClickAndHold]);
  useEffect(() => {
    onHoldEndRef.current = onHoldEnd;
  }, [onHoldEnd]);

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (e.button !== 0) {
        return;
      }
      stopTimer();
      e.preventDefault();
      pointerIdRef.current = e.pointerId;
      buttonRef.current?.setPointerCapture(e.pointerId);
      startTimer();
    },
    [startTimer, stopTimer],
  );

  const handlePointerEnd = useCallback(() => {
    stopTimer();
    onHoldEndRef.current?.();
  }, [stopTimer]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onClickAndHoldRef.current();
      e.preventDefault();
    }
  }, []);

  const handleKeyboardEnd = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onHoldEndRef.current?.();
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyboardEnd}
    >
      {children}
    </button>
  );
};
