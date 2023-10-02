import { CourseType } from "../../../../../_entities/course.entity";
import UpdateCourseButton from "../atom/UpdateCourseButton";
import SchoolsEnumeration from "../molecule/SchoolsEnumeration";
import Metrics from "./Metrics";
import Timeline from "./Timeline";

import { getSelectedCourse } from "../../../map/component/organism/Courses";
import RemoveCourseButton from "../atom/RemoveCourseButton";
import CollapsibleElement from "./CollapsibleElement";
import "./CourseInformationBoardContent.css";
export function BusCourseInformationBoardContent() {
  return (
    <div class="bus-course-information-board-content">
      {/* TODO Put th e2 next component in "organism" */}
      <div class="bus-course-information-board-content-title">
        <div class="bus-course-information-board-content-name">
          {getSelectedCourse()?.name}
        </div>
        <UpdateCourseButton course={getSelectedCourse() as CourseType} />
        <RemoveCourseButton course={getSelectedCourse() as CourseType} />
      </div>
      <div class="bus-course-information-board-content-schools">
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
