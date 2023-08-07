import L from "leaflet";
import { Accessor, For, Setter, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { useStateGui } from "../../../../../StateGui";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { SchoolService } from "../../../../../_services/school.service";
import { PointInterface } from "../atom/Point";
import PointEtablissement from "../molecule/PointEtablissement";

const [, { nextLeafletPointId }] = useStateGui();

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();

export interface PointsEtablissementProps {
  leafletMap: L.Map;
  mapId: number;

  // TODO Utilisé pour les test et les story, possibilité de s'en passer ? Mocker ?
  items?: LeafletSchoolType[];
}

export const [getLeafletSchools, setLeafletSchools] = createSignal<
  LeafletSchoolType[]
>([]);

// TODO to delete and all reference
export const [etablissements, setEtablissements] = createSignal<
  PointInterface[]
>([]);

export default function (props: PointsEtablissementProps) {
  onMount(async () => {
    let leafletSchools: LeafletSchoolType[];
    if (!props.items) {
      const schools: SchoolType[] = await SchoolService.getAll();
      leafletSchools = buildLeafletSchools(schools);
    } else {
      leafletSchools = props.items;
    }
    setLeafletSchools(leafletSchools);
  });

  console.log(etablissementFilter());
  //TODO to change
  function etablissementFilter(): PointInterface[] {
    const isValidate = getLineUnderConstruction().confirmSelection;

    let displayedEtablissements = etablissements();

    if (isInAddLineMode()) {
      const etablissementsSelected =
        getLineUnderConstruction().etablissementSelected;

      if (isValidate && etablissementsSelected) {
        displayedEtablissements = etablissements().filter((value) =>
          etablissementsSelected.some(
            (etablissementInfo) => etablissementInfo.idPoint === value.idPoint
          )
        );
      }
    }
    return displayedEtablissements as PointInterface[];
  }

  return (
    <For each={getLeafletSchools()}>
      {(point) => {
        return <PointEtablissement point={point} map={props.leafletMap} />;
      }}
    </For>
  );
}

export type LeafletSchoolType = {
  leafletId: number;
  // TODO check utility
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
} & StopType;

function buildLeafletSchools(schools: SchoolType[]): LeafletSchoolType[] {
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
