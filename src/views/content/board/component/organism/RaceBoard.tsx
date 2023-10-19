import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";

import { RaceEntity, RaceType } from "../../../../../_entities/trip.entity";
import { selectedRace } from "../../../map/component/organism/Trips";
import RemoveRaceButton from "../atom/RemoveCourseButton";
import { UpdateRaceButton } from "../atom/UpdateRaceButton";
import CollapsibleElement from "./CollapsibleElement";
import "./CourseInformationBoardContent.css";
import { RaceTimeline } from "./RaceTimeline";
export function RaceBoard() {
  // TODO revoir le code pour setter une const trip

  return (
    <div class="bus-course-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-course-information-board-content-title">
        <div class="bus-course-information-board-content-name">
          {selectedRace()?.name}
        </div>
        <UpdateRaceButton trip={selectedRace() as RaceType} />
        <RemoveRaceButton course={selectedRace() as RaceType} />
      </div>
      <div class="bus-course-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            selectedRace()?.schools.map((school) => school.name) ?? []
          }
        />
      </div>

      <CollapsibleElement title="Métriques">
        <Metrics trip={selectedRace()} />
      </CollapsibleElement>

      <CollapsibleElement title="TimeLine" class="timeline-collapsise">
        <RaceTimeline
          trip={selectedRace() ?? RaceEntity.defaultRace()}
          inDraw={false}
        />
      </CollapsibleElement>
    </div>
  );
}
