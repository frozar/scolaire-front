import L from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { useStateGui } from "../../../../../StateGui";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolService } from "../../../../../_services/school.service";
import { SchoolPoint } from "../molecule/SchoolPoint";

const [, { nextLeafletPointId }] = useStateGui();

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();

export interface SchoolPointsProps {
  leafletMap: L.Map;
}

export const [getSchools, setSchools] = createSignal<SchoolType[]>([]);

export function SchoolPoints(props: SchoolPointsProps) {
  onMount(async () => {
    const leafletSchools: SchoolType[] = await SchoolService.getAll();
    const schools: SchoolType[] = buildLeafletSchools(leafletSchools);
    setSchools(schools);
  });

  return (
    <For each={leafletSchoolsFilter()}>
      {(point) => {
        return <SchoolPoint point={point} map={props.leafletMap} />;
      }}
    </For>
  );
}

function buildLeafletSchools(schools: SchoolType[]): SchoolType[] {
  // TODO ununderstood lint error
  return schools.map((school) => {
    const [selected, setSelected] = createSignal(false);
    return {
      ...school,
      setSelected,
      selected,
      leafletId: nextLeafletPointId(),
    };
  });
}

function leafletSchoolsFilter(): SchoolType[] {
  const isValidate = getLineUnderConstruction().confirmSelection;

  let schools = getSchools();

  if (isInAddLineMode()) {
    const etablissementsSelected = getLineUnderConstruction().busLine.schools;

    if (isValidate && etablissementsSelected) {
      schools = schools.filter((value) =>
        etablissementsSelected.some(
          (etablissementInfo) => etablissementInfo.id === value.id
        )
      );
    }
  }
  return schools;
}
