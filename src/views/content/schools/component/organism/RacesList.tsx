import { For } from "solid-js";
import { RaceType } from "../../../../../_entities/race.entity";
import { RaceItem } from "../molecule/RaceItem";
import "./RacesList.css";

export function RacesList(props: { races: RaceType[] }) {
  return (
    <div class="races-list">
      <For each={props.races}>{(race) => <RaceItem race={race} />}</For>
    </div>
  );
}
