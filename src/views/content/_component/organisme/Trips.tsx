import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";
import { Trip } from "../../map/component/molecule/Trip";

export const arrowsMap = new Map<number, L.Marker[]>();

export type leafletBusTripType = {
  polyline: L.Polyline;
  arrows: L.Marker[];
};

export const [displayTrips, setDisplayTrips] = createSignal<TripType[]>([]);

export function Trips(props: { map: L.Map }) {
  createEffect(() => {
    console.log(displayTrips());
  });

  return (
    <For each={displayTrips()}>
      {(trip) => {
        return <Trip trip={trip} map={props.map} />;
      }}
    </For>
  );
}
