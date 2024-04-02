import L from "leaflet";
import { For, createEffect } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolStore, getSchools } from "../../../../../_stores/school.store";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
} from "../../../board/component/organism/DrawTripBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
} from "../../../line/template/LineAdd";
import { SchoolPoint } from "../molecule/SchoolPoint";
import { getSelectedLine } from "./BusLines";

export interface SchoolPointsProps {
  leafletMap: L.Map;
  schools: SchoolType[];
}

export function getSchoolWhereClassId(gradeId: number): SchoolType | undefined {
  return getSchools().filter((school) =>
    school.grades.map((grade) => grade.id).includes(gradeId)
  )[0];
}

export function SchoolPoints(props: SchoolPointsProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(() => SchoolStore.set(props.schools));

  return (
    <For each={schoolsFilter()}>
      {(point) => {
        return <SchoolPoint school={point} map={props.leafletMap} />;
      }}
    </For>
  );
}

//TODO Delete and replace with displayedSchool signal
function schoolsFilter(): SchoolType[] {
  switch (onBoard()) {
    case "line-add":
      switch (addLineCurrentStep()) {
        case AddLineStep.gradeSelection:

        case AddLineStep.stopSelection:
          return getSchools().filter((schoolToFilter) =>
            addLineSelectedSchool()
              .map((school) => school.id)
              .includes(schoolToFilter.id)
          );
      }
      break;

    case "trip":
      return getSchools().filter((schoolFilter) =>
        getSelectedLine()
          ?.schools.map((school) => school.id)
          .includes(schoolFilter.id)
      );
    case "trip-draw":
      switch (currentStep()) {
        case DrawTripStep.schoolSelection:
          return getSchools().filter((schoolFilter) =>
            getSelectedLine()
              ?.schools.map((school) => school.id)
              .includes(schoolFilter.id)
          );
        case DrawTripStep.gradeSelection:
          return getSchools().filter((schoolFilter) =>
            currentDrawTrip()
              ?.schools.map((school) => school.id)
              .includes(schoolFilter.id)
          );
        case DrawTripStep.buildReverse:
        case DrawTripStep.editTrip:
          return getSchools().filter((schoolTofilter) =>
            currentDrawTrip()
              .schools.map((school) => school.id)
              .includes(schoolTofilter.id)
          );
      }
  }

  return getSchools();
}
