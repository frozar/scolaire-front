import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";

import { RaceEntity, RaceType } from "../../../../../_entities/race.entity";
import { selectedRace } from "../../../map/component/organism/Races";
import RemoveRaceButton from "../atom/RemoveCourseButton";
import { UpdateRaceButton } from "../atom/UpdateRaceButton";
import CollapsibleElement from "./CollapsibleElement";
import "./CourseInformationBoardContent.css";
import { RaceTimeline } from "./RaceTimeline";
export function RaceBoard() {
  // TODO revoir le code pour setter une const race

  return (
    <div class="bus-course-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-course-information-board-content-title">
        <div class="bus-course-information-board-content-name">
          {selectedRace()?.name}
        </div>
        <UpdateRaceButton race={selectedRace() as RaceType} />
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
        <Metrics race={selectedRace()} />
      </CollapsibleElement>

      <CollapsibleElement title="TimeLine" class="timeline-collapsise">
        <RaceTimeline
          race={selectedRace() ?? RaceEntity.defaultRace()}
          inDraw={false}
        />
      </CollapsibleElement>
    </div>
  );
}
