import { For, createSignal } from "solid-js";
import { getBus } from "../../../bus/organism/Bus";
import { currentDrawTrip, setCurrentDrawTrip } from "../organism/DrawTripBoard";
import "./BusSelectionList.css";

export function BusSelectionList() {
  const [selectedBus, setSelectedBus] = createSignal<number | undefined>(
    currentDrawTrip().busCategoriesId
  );

  function onInputChanged(value: number) {
    setSelectedBus(value);
    setCurrentDrawTrip((prev) => {
      if (!prev) return prev;
      return { ...prev, busCategoriesId: value };
    });
  }

  return (
    <div class="mt-5">
      <p class="busSelectionTitle">Catégorie de bus</p>
      <select
        class="busSelectionList"
        value={selectedBus()}
        onInput={(e) => onInputChanged(Number(e.currentTarget.value))}
      >
        <option value={-1} disabled selected hidden>
          Choisir un bus
        </option>
        <For each={getBus()}>
          {(bus) => <option value={bus.id}>{bus.category}</option>}
        </For>
      </select>
    </div>
  );
}
