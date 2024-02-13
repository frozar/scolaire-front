import { createSignal } from "solid-js";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { getBus } from "../../../bus/organism/Bus";
import { currentDrawTrip, setCurrentDrawTrip } from "../organism/DrawTripBoard";
import "./BusSelectionList.css";

export function BusSelectionList() {
  const [selectedBus, setSelectedBus] = createSignal<number | undefined>(
    currentDrawTrip().busCategoriesId
  );

  function onInputChanged(value: string | number) {
    setSelectedBus(Number(value));
    setCurrentDrawTrip((prev) => {
      if (!prev) return prev;
      return { ...prev, busCategoriesId: Number(value) };
    });
  }

  return (
    <LabeledInputSelect
      defaultValue={Number(selectedBus())}
      label="Catégorie de bus"
      onChange={onInputChanged}
      options={getBus().map((bus) => {
        return { value: Number(bus.id), text: bus.category };
      })}
    />
  );
}
