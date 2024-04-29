import L from "leaflet";
import { For, createSignal } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";
import { Trip } from "../molecule/Trip";

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusTripType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

export const [displayTrips, setDisplayTrips] = createSignal<TripType[]>([]);

export const [isOnRoadDisplay, setIsOnRoadDisplay] =
  createSignal<boolean>(true);

export function Trips(props: { map: L.Map }) {
  return (
    <For each={displayTrips()}>
      {(trip) => {
        return <Trip trip={trip} map={props.map} onRoad={isOnRoadDisplay()} />;
      }}
    </For>
  );
}
