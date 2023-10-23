import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
} from "../../../board/component/organism/DrawTripBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { SchoolPoint } from "../molecule/SchoolPoint";
import { getSelectedLine } from "./BusLines";

export interface SchoolPointsProps {
  leafletMap: L.Map;
  schools: SchoolType[];
}

export const [getSchools, setSchools] = createSignal<SchoolType[]>([]);

export function getSchoolWhereClassId(gradeId: number): SchoolType | undefined {
  return getSchools().filter((school) =>
    school.grades.map((grade) => grade.id).includes(gradeId)
  )[0];
}

export function SchoolPoints(props: SchoolPointsProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(() => setSchools(props.schools));

  return (
    <For each={schoolsFilter()}>
      {(point) => {
        return <SchoolPoint point={point} map={props.leafletMap} />;
      }}
    </For>
  );
}

//TODO Delete and replace with displayedSchool signal
function schoolsFilter(): SchoolType[] {
  switch (onBoard()) {
    case "line-add":
      switch (addLineCurrentStep()) {
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
