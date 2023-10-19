import { For } from "solid-js";
import { TripType } from "../../../../../_entities/trip.entity";
import TripItem from "../molecule/TripItem";
import "./TripsList.css";

export default function (props: { courses: TripType[] }) {
  return (
    <div class="school-details-line-list">
      <For each={props.courses}>{(item) => <TripItem line={item} />}</For>
    </div>
  );
}
