import L from "leaflet";
import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { Trip } from "../molecule/Trip";

import { TripEntity, TripType } from "../../../../../_entities/trip.entity";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
} from "../../../board/component/organism/DrawTripBoard";
import {
  TripBoardPanels,
  onTripBoardPanel,
} from "../../../board/component/organism/TripsBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { stopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { getLines, getSelectedLine } from "./BusLines";

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusTripType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

// TODO: Rename
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

  const tripsFilter = () => {
    switch (onBoard()) {
      case "line-add":
        return [];
      case "trip":
        if (onTripBoardPanel() == TripBoardPanels.trips)
          return getSelectedLine()?.trips;
        else return [];
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

      case "stop-details":
        const stopId = stopDetailsItem()?.id;
        if (!stopId) return [];
        return TripEntity.getStopTrips(stopId);

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
