import { Setter, createSignal, onMount } from "solid-js";
import { BusCategoryType } from "../organism/Bus";
import { BusEditContent } from "./BusEditContent";
import { BusEditHeader } from "./BusEditHeader";

interface BusEditMenuProps {
  busItem: BusCategoryType;
  setBusItem: Setter<BusCategoryType>;
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusEditMenu(props: BusEditMenuProps) {
  const [isPMROn, setIsPMROn] = createSignal(true);

  onMount(() => {
    if (!(props.busItem.accessibility == "PMR")) setIsPMROn(false);
  });

  return (
    <div>
      <BusEditHeader title={props.busItem.name} />
      <BusEditContent
        isPMROn={isPMROn()}
        onPMRChange={setIsPMROn}
        busItem={props.busItem}
        setBusItem={props.setBusItem}
        cancelFunction={props.cancelFunction}
        submitFunction={props.submitFunction}
      />
    </div>
  );
}
