import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { Race } from "../molecule/Race";

import { createStore } from "solid-js/store";
import { RaceEntity, RaceType } from "../../../../../_entities/race.entity";
import {
  DrawRaceStep,
  currentRace,
  currentStep,
} from "../../../board/component/organism/DrawRaceBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { getLines, getSelectedLine } from "./BusLines";

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusRaceType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

export const [getRaces, setRaces] = createStore<RaceType[]>([]);

export const [selectedRace, setSelectedRace] = createSignal<RaceType>();

export function Races(props: { map: L.Map }) {
  // eslint-disable-next-line solid/reactivity
  // createEffect(async () => {
  //   if (pointsReady()) {
  //     await RaceUtils.set();
  //   }
  // });

  createEffect(() => {
    setRaces(getSelectedLine()?.courses ?? []);
  });

  onCleanup(() => {
    setRaces([]);
  });

  const racesFilter = () => {
    if (currentStep() > DrawRaceStep.initial) {
      // delete all arrows
      arrowsMap.forEach((arrows) =>
        arrows.map((arrow) => props.map.removeLayer(arrow))
      );
      arrowsMap.clear();

      return [currentRace()];
    }

    switch (onBoard()) {
      case "line-add":
        return [];

      case "line":
        return getLines()
          .map((line) => line.courses)
          .flat();

      case "stop-details":
        const stopId = stopDetailsItem()?.id;
        if (!stopId) return [];
        return RaceEntity.getStopRaces(stopId);

      case "line-details":
        return [selectedRace() as RaceType];
    }
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
