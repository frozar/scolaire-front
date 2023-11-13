import { createSignal } from "solid-js";
import { Filter } from "../molecule/Filter";
import "./Filters.css";

export const [filterEmptyStops, setFilterEmptyStops] =
  createSignal<boolean>(false);

export function Filters() {
  return (
    <div id="filters">
      <p>Filtres: </p>
      <Filter
        title="Cacher les arrêts vides"
        getter={filterEmptyStops}
        setter={setFilterEmptyStops}
      />
    </div>
  );
}
