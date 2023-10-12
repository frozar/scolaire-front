import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolService } from "../../../../../_services/school.service";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawRaceStep,
  currentRace,
  currentStep,
} from "../../../board/component/organism/DrawRaceBoard";
import { onBoard } from "../../../board/component/template/ContextManager";
import { SchoolPoint } from "../molecule/SchoolPoint";
import { getSelectedLine } from "./BusLines";

export interface SchoolPointsProps {
  leafletMap: L.Map;
}

export const [getSchools, setSchools] = createSignal<SchoolType[]>([]);

export function SchoolPoints(props: SchoolPointsProps) {
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => updateSchools());

  return (
    <For each={schoolsFilter()}>
      {(point) => {
        return <SchoolPoint point={point} map={props.leafletMap} />;
      }}
    </For>
  );
}

async function updateSchools() {
  const schools: SchoolType[] = await SchoolService.getAll();
  setSchools(schools);
}

//TODO Delete and replace with displayedSchool signal
function schoolsFilter(): SchoolType[] {
  let schools = getSchools().filter((school) =>
    getSelectedLine()
      ? getSelectedLine()
          ?.schools.map((schoolMap) => schoolMap.id)
          .includes(school.id)
      : true
  );

  if (onBoard() == "race-draw") {
    const schoolsSelected = currentRace.schools;
    if (currentStep() === DrawRaceStep.schoolSelection) {
      return schools;
    }

    schools = schools.filter((value) =>
      schoolsSelected.some(
        (etablissementInfo) => etablissementInfo.id === value.id
      )
    );
  }

  if (
    onBoard() == "line-add" &&
    addLineCurrentStep() == AddLineStep.stopSelection
  ) {
    return schools.filter((school) =>
      addLineSelectedSchool()
        .map((schoolSelected) => schoolSelected.id)
        .includes(school.id)
    );
  }
  return schools;
}
