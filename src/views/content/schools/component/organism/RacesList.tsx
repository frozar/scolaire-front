import { For } from "solid-js";
import { RaceType } from "../../../../../_entities/trip.entity";
import { RaceItem } from "../molecule/RaceItem";
import "./RacesList.css";

export function RacesList(props: { trips: RaceType[] }) {
  return (
    <div class="trips-list">
      <For each={props.trips}>{(trip) => <RaceItem trip={trip} />}</For>
    </div>
  );
}
