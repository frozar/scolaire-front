import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { Race } from "../molecule/Race";

import { createStore } from "solid-js/store";
import { RaceType } from "../../../../../_entities/race.entity";
import { RaceUtils } from "../../../../../utils/race.utils";
import {
  DrawModeStep,
  currentRace,
  currentStep,
} from "../../../board/component/organism/DrawRaceBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { pointsReady } from "./Points";

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusCourseType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

export const [getRaces, setRaces] = createStore<RaceType[]>([]);

export const [selectedRace, setSelectedRace] = createSignal<RaceType>();

export function Races(props: { map: L.Map }) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (pointsReady()) {
      await RaceUtils.set();
    }
  });

  createEffect(() => {
    const race = selectedRace();
  });

  onCleanup(() => {
    setRaces([]);
  });

  const racesFilter = () => {
    if (currentStep() > DrawModeStep.start) {
      // delete all arrows
      arrowsMap.forEach((arrows) =>
        arrows.map((arrow) => props.map.removeLayer(arrow))
      );
      arrowsMap.clear();

      return [currentRace];
    }
    if (onBoard() == "line-add") {
      return [];
    }

    return getRaces;
  };

  return (
    <For each={racesFilter()}>
      {(race) => {
        return <Race race={race} map={props.map} />;
      }}
    </For>
  );
}

export function deselectAllRaces() {
  setSelectedRace();
}

export function updateRaces(race: RaceType) {
  setRaces((races) => {
    const updated = races.filter((r) => r.id != race.id);
    updated.push(race);
    return updated;
  });
}
