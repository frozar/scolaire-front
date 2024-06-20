import { Setter, Show, createEffect, onCleanup, onMount } from "solid-js";
import { TripPointType, TripType } from "../../../../_entities/trip.entity";
import { setDisplayTrips } from "../../_component/organisme/Trips";

import "./TripTimeline.css";
import { TripTimelinePoints } from "./TripTimelinePoints";

export function TripTimeline(props: {
  tripPoints: TripPointType[];
  trip: TripType;
  setTrip: Setter<TripType>;
  inDraw: boolean;
}) {
  onMount(() => {
    setDisplayTrips([props.trip]);
  });

  createEffect(() => {
    setDisplayTrips([props.trip]);
  });

  onCleanup(() => {
    setDisplayTrips([]);
  });

  return (
    <div class="triptimeline">
      <Show
        fallback={
          <div class="triptimeline-info">
            Veuillez sélectionner des points sur la carte
          </div>
        }
        when={(props.trip.tripPoints.length ?? 0) > 0}
      >
        <TripTimelinePoints
          trip={props.trip}
          setTrip={props.setTrip}
          inDraw={props.inDraw}
        />
      </Show>
    </div>
  );
}
