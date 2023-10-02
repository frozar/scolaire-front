import { BusCourseType } from "../../../../../_entities/bus-course.entity";
import UpdateCourseButton from "../atom/UpdateCourseButton";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

import { getSelectedBusCourse } from "../../../map/component/organism/BusCourses";
import RemoveCourseButton from "../atom/RemoveCourseButton";
import "./BusCourseInformationBoardContent.css";
import CollapsibleElement from "./CollapsibleElement";
export function BusCourseInformationBoardContent() {
  return (
    <div class="bus-course-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-course-information-board-content-title">
        <div class="bus-course-information-board-content-name">
          {getSelectedBusCourse()?.name}
        </div>
        <UpdateCourseButton
          busCourse={getSelectedBusCourse() as BusCourseType}
        />
        <RemoveCourseButton
          busCourse={getSelectedBusCourse() as BusCourseType}
        />
      </div>
      <div class="bus-course-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            getSelectedBusCourse()?.schools.map((school) => school.name) ?? []
          }
        />
      </div>

      <CollapsibleElement title="Métriques">
        <Metrics line={getSelectedBusCourse()} />
      </CollapsibleElement>

      <CollapsibleElement title="TimeCourse" class="timeline-collapsise">
        <Timeline />
      </CollapsibleElement>
    </div>
  );
}
