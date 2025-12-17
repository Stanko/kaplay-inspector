import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

export type HoldButtonProps = {
  children?: JSX.Element | string | number;
  className?: string;
  onClickAndHold: () => void;
  interval?: number;
  startRepeatingDelay?: number;
};

export const HoldButton = ({
  children,
  className,
  onClickAndHold,
  interval = 50,
  startRepeatingDelay = 200,
}: HoldButtonProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);

    if (isMouseDown) {
      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          onClickAndHold();
        }, interval);
      }, startRepeatingDelay);
    }
  }, [isMouseDown]);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <button
      className={className}
      onMouseDown={handleMouseDown}
      onClick={onClickAndHold}
    >
      {children}
    </button>
  );
};
