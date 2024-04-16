import { createSignal } from "solid-js";
import { TripType } from "../../../../_entities/trip.entity";
import { DisplayAllotmentAndVehicle } from "../../board/component/organism/DisplayAllotmentAndVehicle";
import Metrics from "../../board/component/organism/Metrics";
import { TripTimeline } from "../../board/component/organism/TripTimeline";
import { DisplayTripDaysAndDirection } from "../../board/component/organism/displayTripDaysAndDirection";
import CollapsibleElement from "../../line/atom/CollapsibleElement";
import { TripDetailsHeader } from "../organism/TripDetailsHeader";

import "./TripDetails.css";

export const [selectedTrip, setSelectedTrip] = createSignal<TripType>();

export function TripDetails() {
  console.log(selectedTrip());

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
