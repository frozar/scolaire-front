import { createSignal, onCleanup, onMount } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";
import { DisplayAllotmentAndVehicle } from "../../board/component/organism/DisplayAllotmentAndVehicle";
import Metrics from "../../board/component/organism/Metrics";
import { TripTimeline } from "../../board/component/organism/TripTimeline";
import { DisplayTripDaysAndDirection } from "../../board/component/organism/displayTripDaysAndDirection";
import CollapsibleElement from "../../line/atom/CollapsibleElement";
import { TripDetailsHeader } from "../organism/TripDetailsHeader";

import { SchoolType } from "../../../../_entities/school.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { StopStore } from "../../../../_stores/stop.store";
import { NatureEnum } from "../../../../type";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import { setDisplayTrips } from "../../_component/organisme/Trips";
import "./TripDetails.css";

export const [selectedTrip, setSelectedTrip] = createSignal<TripType>();

export function TripDetails() {
  console.log(selectedTrip());

  onMount(() => {
    const trip = selectedTrip() as TripType;
    const stops: StopType[] = [];
    for (const point of trip.tripPoints) {
      if (point.nature == NatureEnum.stop && StopStore.get(point.id)) {
        stops.push(StopStore.get(point.id) as StopType);
      }
    }
    setDisplaySchools(trip.schools as SchoolType[]);
    setDisplayStops(stops);
    setDisplayTrips([trip]);
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
    setDisplayTrips([]);
  });

  return (
    <div class="bus-trip-information-board-content">
      <TripDetailsHeader trip={selectedTrip() as TripType} />
      <CollapsibleElement title="Métriques">
        <Metrics trip={selectedTrip()} />
      </CollapsibleElement>
      <DisplayTripDaysAndDirection trip={selectedTrip()} />
      <DisplayAllotmentAndVehicle trip={selectedTrip()} />
      <CollapsibleElement title="TimeLine" class="timeline-collapsise">
        <TripTimeline trip={selectedTrip() as TripType} inDraw={false} />
      </CollapsibleElement>
    </div>
  );
}
