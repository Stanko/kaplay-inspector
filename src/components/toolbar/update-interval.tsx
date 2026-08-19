import { RefreshCcw } from "lucide-preact";
import { useApp } from "../../lib/app-context";
import { Dropdown } from "../inputs/dropdown";

const INTERVAL_OPTIONS = [
  { value: 100, label: "100ms" },
  { value: 250, label: "250ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1s" },
];

export const UpdateInterval = () => {
  const { updateInterval, setUpdateInterval } = useApp();

  return (
    <Dropdown
      tooltip="Change Update Interval"
      items={INTERVAL_OPTIONS}
      selectedValue={updateInterval}
      onChange={setUpdateInterval}
    >
      <RefreshCcw />
    </Dropdown>
  );
};
