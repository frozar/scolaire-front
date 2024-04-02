import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { Trip } from "../molecule/Trip";

import { TripType } from "../../../../../_entities/trip.entity";
import { getLines } from "../../../../../_stores/line.store";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
} from "../../../board/component/organism/DrawTripBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { getSelectedLine } from "./BusLines";

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusTripType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

// TODO: To Delete
export const [getTrips, setTrips] = createSignal<TripType[]>([]);

export const [selectedTrip, setselectedTrip] = createSignal<TripType>();

export function Trips(props: { map: L.Map }) {
  // eslint-disable-next-line solid/reactivity

  createEffect(() => {
    setTrips(getSelectedLine()?.trips ?? []);
  });

  onCleanup(() => {
    setTrips([]);
  });

  //TODO to refacto dans les board
  const tripsFilter = () => {
    switch (onBoard()) {
      case "line-add":
        return [];
      // case "trip":
      //   if (onTripBoardPanel() == TripBoardPanels.trips)
      //     return getSelectedLine()?.trips;
      //   else return [];
      case "line":
        return getLines()
          .map((line) => line.trips)
          .flat();
      case "trip-draw":
        switch (currentStep()) {
          case DrawTripStep.buildReverse:
          case DrawTripStep.editTrip:
            // delete all arrows
            arrowsMap.forEach((arrows) =>
              arrows.map((arrow) => props.map.removeLayer(arrow))
            );
            arrowsMap.clear();

            return [currentDrawTrip()];
        }
        break;

      // case "stop-details":
      //   const stopId = stopDetails()?.id;
      //   if (!stopId) return [];
      //   return TripEntity.getStopTrips(stopId);

      case "line-details":
        return [selectedTrip() as TripType];
    }
  };

  return (
    <For each={tripsFilter()}>
      {(trip) => {
        return <Trip trip={trip} map={props.map} />;
      }}
    </For>
  );
}

export function deselectAllTrips() {
  setselectedTrip();
}

export function updateTrips(trip: TripType) {
  setTrips((trips) => {
    const updated = trips.filter((r) => r.id != trip.id);
    updated.push(trip);
    return updated;
  });
}
