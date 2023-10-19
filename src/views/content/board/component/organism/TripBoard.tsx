import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";

import { TripEntity, TripType } from "../../../../../_entities/trip.entity";
import { selectedTrip } from "../../../map/component/organism/Trips";
import RemoveTripButton from "../atom/RemoveCourseButton";
import { UpdateTripButton } from "../atom/UpdateTripButton";
import CollapsibleElement from "./CollapsibleElement";
import "./CourseInformationBoardContent.css";
import { TripTimeline } from "./TripTimeline";
export function TripBoard() {
  // TODO revoir le code pour setter une const trip

  return (
    <div class="bus-trip-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-trip-information-board-content-title">
        <div class="bus-trip-information-board-content-name">
          {selectedTrip()?.name}
        </div>
        <UpdateTripButton trip={selectedTrip() as TripType} />
        <RemoveTripButton trip={selectedTrip() as TripType} />
      </div>
      <div class="bus-trip-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            selectedTrip()?.schools.map((school) => school.name) ?? []
          }
        />
      </div>

      <CollapsibleElement title="Métriques">
        <Metrics trip={selectedTrip()} />
      </CollapsibleElement>

      <CollapsibleElement title="TimeLine" class="timeline-collapsise">
        <TripTimeline
          trip={selectedTrip() ?? TripEntity.defaultTrip()}
          inDraw={false}
        />
      </CollapsibleElement>
    </div>
  );
}
