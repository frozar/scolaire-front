import { CourseType } from "../../../../../_entities/course.entity";
import UpdateLineButton from "../atom/UpdateLineButton";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

import { getSelectedCourse } from "../../../map/component/organism/Courses";
import RemoveLineButton from "../atom/RemoveLineButton";
import CollapsibleElement from "./CollapsibleElement";
import "./CourseInformationBoardContent.css";
export function CourseInformationBoardContent() {
  return (
    <div class="course-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="course-information-board-content-title">
        <div class="course-information-board-content-name">
          {getSelectedCourse()?.name}
        </div>
        <UpdateLineButton busLine={getSelectedCourse() as CourseType} />
        <RemoveLineButton busLine={getSelectedCourse() as CourseType} />
      </div>
      <div class="course-information-board-content-schools">
        <SchoolsEnumeration
          schoolsName={
            getSelectedCourse()?.schools.map((school) => school.name) ?? []
          }
        />
      </div>

      <CollapsibleElement title="Métriques">
        <Metrics line={getSelectedCourse()} />
      </CollapsibleElement>

      <CollapsibleElement title="TimeLine" class="timeline-collapsise">
        <Timeline />
      </CollapsibleElement>
    </div>
  );
}
