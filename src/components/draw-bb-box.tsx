import { useApp } from "../lib/app-context";

interface DrawBBoxProps {
  disabled?: boolean;
}

export const DrawBBox = ({ disabled = false }: DrawBBoxProps) => {
  const { isDrawBBoxActive, setAppState } = useApp();

  return (
    <label>
      <input
        disabled={disabled}
        type="checkbox"
        checked={isDrawBBoxActive}
        onChange={() =>
          setAppState({
            isDrawBBoxActive: !isDrawBBoxActive,
          })
        }
      />
      Draw bbox on hover
    </label>
  );
};
