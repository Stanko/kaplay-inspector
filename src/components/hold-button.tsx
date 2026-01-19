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
  // const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const onClickAndHoldRef = useRef(onClickAndHold);
  const onHoldEndRef = useRef(onHoldEnd);

  const startTimer = useCallback(() => {
    stopTimer();
    // setIsActive(true);
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
    // setIsActive(false);
    clearTimeout(timerRef.current);
    clearInterval(timerRef.current);
  }, []);

  const handleHoldEnd = useCallback(() => {
    // console.log("---------end", isActive);
    // if (isActive) {
    stopTimer();
    onHoldEndRef.current?.();
    // }
  }, [
    stopTimer,
    // , isActive
  ]);

  // Keep references updated to the latest callbacks
  // This ensures the interval always calls the latest version
  useEffect(() => {
    onClickAndHoldRef.current = onClickAndHold;
  }, [onClickAndHold]);
  useEffect(() => {
    onClickAndHoldRef.current = onClickAndHold;
  }, [onClickAndHold]);

  // Use document on mouseup and touchend for nicer UX
  useEffect(() => {
    document.addEventListener("mouseup", handleHoldEnd);
    document.addEventListener("touchend", handleHoldEnd);

    return () => {
      stopTimer();
      document.removeEventListener("mouseup", handleHoldEnd);
      document.removeEventListener("touchend", handleHoldEnd);
    };
  }, [handleHoldEnd]);

  return (
    <button
      className={className}
      onMouseDown={startTimer}
      onTouchStart={startTimer}
    >
      {children}
    </button>
  );
};
