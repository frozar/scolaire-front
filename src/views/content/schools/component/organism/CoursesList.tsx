import { For } from "solid-js";
import { RaceType } from "../../../../../_entities/race.entity";
import RaceItem from "../molecule/RaceItem";
import "./RacesList.css";

export default function (props: { courses: RaceType[] }) {
  return (
    <div class="school-details-line-list">
      <For each={props.courses}>{(item) => <RaceItem line={item} />}</For>
    </div>
  );
}
