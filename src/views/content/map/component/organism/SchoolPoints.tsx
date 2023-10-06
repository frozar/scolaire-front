import L from "leaflet";
import { For, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolService } from "../../../../../_services/school.service";
import {
  currentStep,
  drawModeStep,
} from "../../../board/component/organism/DrawModeBoardContent";
import { onBoard } from "../../../board/component/template/ContextManager";
import { SchoolPoint } from "../molecule/SchoolPoint";

const [, { getCourseUnderConstruction }] = useStateAction();

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
  console.log("Schools préléminaire", schools);
}

//TODO Delete and replace with displayedSchool signal
function schoolsFilter(): SchoolType[] {
  let schools = getSchools();

  if (onBoard() == "line-draw") {
    const schoolsSelected = getCourseUnderConstruction().course.schools;
    if (currentStep() === drawModeStep.schoolSelection) {
      return schools;
    }

    schools = schools.filter((value) =>
      schoolsSelected.some(
        (etablissementInfo) => etablissementInfo.id === value.id
      )
    );
  }
  return schools;
}
