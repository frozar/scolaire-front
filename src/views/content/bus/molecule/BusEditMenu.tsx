import { createSignal, onMount } from "solid-js";
import { BusEditContent } from "./BusEditContent";
import { BusEditHeader } from "./BusEditHeader";

interface BusEditMenuProps {
  id?: number;
  name: string;
  capacity: number;
  capacityStand: number;
  capacityPMR: number;
  category: string;
  access: string;
  length: number;
  width: number;
  height: number;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCapacityChange: (value: number) => void;
  onCapacityStandChange: (value: number) => void;
  onCapacityPMRChange: (value: number) => void;
  onAccessibilityChange: (value: string) => void;
  onLengthChange: (value: number) => void;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusEditMenu(props: BusEditMenuProps) {
  const [isPMROn, setIsPMROn] = createSignal(true);

  onMount(() => {
    if (!(props.access == "PMR")) setIsPMROn(false);
  });

  return (
    <div>
      <BusEditHeader title={props.name} />
      <BusEditContent
        accessibility={props.access}
        capacity={props.capacity}
        capacityStand={props.capacityStand}
        capacityPMR={props.capacityPMR}
        category={props.category}
        name={props.name}
        height={props.height}
        length={props.length}
        width={props.width}
        isPMROn={isPMROn()}
        onPMRChange={setIsPMROn}
        cancelFunction={props.cancelFunction}
        onAccessibilityChange={props.onAccessibilityChange}
        onCapacityChange={props.onCapacityChange}
        onCapacityStandChange={props.onCapacityStandChange}
        onCategoryChange={props.onCategoryChange}
        onCapacityPMRChange={props.onCapacityPMRChange}
        onNameChange={props.onNameChange}
        onLengthChange={props.onLengthChange}
        onWidthChange={props.onWidthChange}
        onHeightChange={props.onHeightChange}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
