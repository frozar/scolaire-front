import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { Trip } from "../molecule/Trip";

import { RaceEntity, RaceType } from "../../../../../_entities/trip.entity";
import {
  DrawRaceStep,
  currentDrawRace,
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

// TODO: Rename
export const [getRaces, setRaces] = createSignal<RaceType[]>([]);

export const [selectedRace, setSelectedRace] = createSignal<RaceType>();

export function Trips(props: { map: L.Map }) {
  // eslint-disable-next-line solid/reactivity

  createEffect(() => {
    setRaces(getSelectedLine()?.courses ?? []);
  });

  onCleanup(() => {
    setRaces([]);
  });

  const racesFilter = () => {
    switch (onBoard()) {
      case "line-add":
        return [];
      case "course":
        return getSelectedLine()?.courses;
      case "line":
        return getLines()
          .map((line) => line.courses)
          .flat();
      case "trip-draw":
        switch (currentStep()) {
          case DrawRaceStep.editRace:
            // delete all arrows
            arrowsMap.forEach((arrows) =>
              arrows.map((arrow) => props.map.removeLayer(arrow))
            );
            arrowsMap.clear();

            return [currentDrawRace()];
        }
        break;

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
      {(trip) => {
        return <Trip trip={trip} map={props.map} />;
      }}
    </For>
  );
}

export function deselectAllRaces() {
  setSelectedRace();
}

export function updateRaces(trip: RaceType) {
  setRaces((trips) => {
    const updated = trips.filter((r) => r.id != trip.id);
    updated.push(trip);
    return updated;
  });
}
