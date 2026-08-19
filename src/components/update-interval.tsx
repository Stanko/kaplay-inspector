import { RefreshCcw } from "lucide-preact";
import { useApp } from "../lib/app-context";

const INTERVAL_OPTIONS = [
  { value: 100, label: "100ms" },
  { value: 250, label: "250ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1s" },
];

export const UpdateInterval = () => {
  const { updateInterval, setUpdateInterval } = useApp();

  return (
    <div class="k-inspector__interval">
      <RefreshCcw />
      {INTERVAL_OPTIONS.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name="interval"
            value={option.value}
            checked={updateInterval === option.value}
            onChange={() => setUpdateInterval(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
