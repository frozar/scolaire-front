import { createSignal, onCleanup, onMount } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { SchoolStore } from "../../../../../_stores/school.store";
import { StopUtils } from "../../../../../utils/stop.utils";
import { setDisplaySchools } from "../../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../../_component/organisme/StopPoints";
import { GradeBoardDetailsHeader } from "../organism/GradeBoardDetailsHeader";
import { GradeBoardDetailsSchedules } from "../organism/GradeBoardDetailsSchedules";
import { GradeDetailsPanels } from "../organism/gradeDetailsPanels";

export const [schoolGradeDetails, setSchoolGradeDetails] =
  createSignal<GradeType>();

export function SchoolGradeDetails() {
  onMount(() => {
    setMapDataGradeDetail(schoolGradeDetails());
  });
  onCleanup(() => {
    setSchoolGradeDetails();
    setMapDataGradeDetail(schoolGradeDetails());
  });

  return (
    <section>
      <GradeBoardDetailsHeader grade={schoolGradeDetails() as GradeType} />
      <GradeBoardDetailsSchedules grade={schoolGradeDetails() as GradeType} />
      <GradeDetailsPanels grade={schoolGradeDetails() as GradeType} />
    </section>
  );
}

export function setMapDataGradeDetail(grade: GradeType | undefined) {
  if (grade && grade.schoolId) {
    const school: SchoolType = SchoolStore.get(grade.schoolId);
    setDisplaySchools([school]);

    const stops: StopType[] = StopUtils.getByLinkedGrade(grade.id as number);
    setDisplayStops(stops);
    // setDisplayTrips(filterTrips(school));
  } else {
    setDisplayStops([]);
    setDisplaySchools([]);
    // setDisplayTrips([]);
  }
}
