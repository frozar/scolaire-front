import { createSignal } from "solid-js";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { getAllotment } from "../../../allotment/organism/Allotment";
import { currentDrawTrip, setCurrentDrawTrip } from "../organism/DrawTripBoard";

export function AllotmentSelectionList() {
  const [selectedAllotment, setSelectedAllotment] = createSignal<
    number | undefined
  >(currentDrawTrip().allotmentId);

  function onInputChanged(value: string | number) {
    setSelectedAllotment(Number(value));
    setCurrentDrawTrip((prev) => {
      if (!prev) return prev;
      return { ...prev, allotmentId: Number(value) };
    });
  }

  return (
    <LabeledInputSelect
      defaultValue={Number(selectedAllotment())}
      label="Allotissement"
      onChange={onInputChanged}
      options={getAllotment().map((allotment) => {
        return { value: Number(allotment.id), text: allotment.name };
      })}
    />
  );
}
