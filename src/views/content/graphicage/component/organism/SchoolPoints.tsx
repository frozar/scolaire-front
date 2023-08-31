import L from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolService } from "../../../../../_services/school.service";
import { SchoolPoint } from "../molecule/SchoolPoint";
import { currentStep, drawModeStep } from "./DrawModeBoardContent";

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();

export interface SchoolPointsProps {
  leafletMap: L.Map;
}

export const [getSchools, setSchools] = createSignal<SchoolType[]>([]);

export function SchoolPoints(props: SchoolPointsProps) {
  onMount(async () => {
    const schools: SchoolType[] = await SchoolService.getAll();
    setSchools(schools);
  });

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
  let schools = getSchools();

  if (isInAddLineMode()) {
    const schoolsSelected = getLineUnderConstruction().busLine.schools;
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
