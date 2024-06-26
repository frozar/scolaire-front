import { Setter } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import "./BusStopsMenuInput.css";

interface BusStopsMenuInputProps {
  item: BusStopType;
  setter: Setter<BusStopType>;
}

export function BusStopsMenuInput(props: BusStopsMenuInputProps) {
  function onInputName(value: string) {
    props.setter((prev) => {
      return { ...prev, name: value };
    });
  }

  return (
    <div class="bus-stop-input">
      <label for="name">Nom</label>
      <input
        class="bus-stop-input-size"
        id="name"
        placeholder="Entrer un nom"
        value={props.item.name ? props.item.name : ""}
        onInput={(e) => onInputName(e.target.value)}
      />
    </div>
  );
}
