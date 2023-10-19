import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawRaceStep,
  currentDrawRace,
  currentStep,
} from "../../../board/component/organism/DrawRaceBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { SchoolPoint } from "../molecule/SchoolPoint";
import { getSelectedLine } from "./BusLines";

export interface SchoolPointsProps {
  leafletMap: L.Map;
  schools: SchoolType[];
}

export const [getSchools, setSchools] = createSignal<SchoolType[]>([]);

export function getSchoolWhereClassId(classId: number): SchoolType | undefined {
  return getSchools().filter((school) =>
    school.classes.map((classe) => classe.id).includes(classId)
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

    case "course":
      return getSchools().filter((schoolFilter) =>
        getSelectedLine()
          ?.schools.map((school) => school.id)
          .includes(schoolFilter.id)
      );
    case "trip-draw":
      switch (currentStep()) {
        case DrawRaceStep.schoolSelection:
          return getSchools().filter((schoolFilter) =>
            getSelectedLine()
              ?.schools.map((school) => school.id)
              .includes(schoolFilter.id)
          );
        case DrawRaceStep.editRace:
          return getSchools().filter((schoolTofilter) =>
            currentDrawRace()
              .schools.map((school) => school.id)
              .includes(schoolTofilter.id)
          );
      }
  }

  return getSchools();
}
