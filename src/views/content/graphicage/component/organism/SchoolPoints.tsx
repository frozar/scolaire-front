import L from "leaflet";
import { Accessor, For, Setter, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { useStateGui } from "../../../../../StateGui";
import { SchoolType } from "../../../../../_entities/school.entity";
import { SchoolService } from "../../../../../_services/school.service";
import { PointInterface } from "../atom/Point";
import { SchoolPoint } from "../molecule/SchoolPoint";

const [, { nextLeafletPointId }] = useStateGui();

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();

export interface SchoolPointsProps {
  leafletMap: L.Map;

  // TODO Utilisé pour les test et les story, possibilité de s'en passer ? Mocker ?
  items?: SchoolType[];
}

export const [getLeafletSchools, setLeafletSchools] = createSignal<
  SchoolType[]
>([]);

// TODO to delete and all reference
export const [etablissements, setEtablissements] = createSignal<
  PointInterface[]
>([]);

export function SchoolPoints(props: SchoolPointsProps) {
  onMount(async () => {
    let leafletSchools: SchoolType[];
    if (!props.items) {
      const schools: SchoolType[] = await SchoolService.getAll();
      leafletSchools = buildLeafletSchools(schools);
    } else {
      leafletSchools = props.items;
    }
    setLeafletSchools(leafletSchools);
  });

  return (
    <For each={leafletSchoolsFilter()}>
      {(point) => {
        return <SchoolPoint point={point} map={props.leafletMap} />;
      }}
    </For>
  );
}

export type LeafletSchoolType = {
  leafletId: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
} & SchoolType;

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

  let schools = getLeafletSchools();

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
