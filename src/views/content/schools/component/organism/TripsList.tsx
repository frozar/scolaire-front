import { For } from "solid-js";
import { TripType } from "../../../../../_entities/trip.entity";
import { TripItem } from "../molecule/TripItem";
import "./TripsList.css";

export function TripsList(props: { trips: TripType[]; openOnClick?: boolean }) {
  return (
    <div class="line-list-content">
      <For each={props.trips}>
        {(trip) => <TripItem trip={trip} openOnClick={props.openOnClick} />}
      </For>
    </div>
  );
}
