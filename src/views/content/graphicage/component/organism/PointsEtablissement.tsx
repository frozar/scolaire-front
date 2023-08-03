import L from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { fetchSchool } from "../../point.service";
import { PointIdentityType, PointInterface } from "../atom/Point";
import PointEtablissement from "../molecule/PointEtablissement";
import { PointRamassageDBType } from "./PointsRamassage";

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();

type PointEtablissementDBType = PointRamassageDBType;

type PointEtablissementCoreType = Omit<PointEtablissementDBType, "id_point"> & {
  idPoint: number;
};

function PointBack2FrontIdPoint(
  data: PointEtablissementDBType
): PointEtablissementCoreType {
  const dataWk = {
    ...data,
    idPoint: data.id_point,
  } as PointEtablissementCoreType & { id_point?: number };
  delete dataWk["id_point"];
  return dataWk;
}

function PointBack2Front<T extends PointEtablissementDBType>(
  datas: T[]
): PointInterface[] {
  return (
    datas
      // Rename "id_point" -> "idPoint"
      .map((data) => PointBack2FrontIdPoint(data))
      // Add signal "selected"
      .map((data) => {
        const [selected, setSelected] = createSignal(false);
        const [associatedPoints, setAssociatedPoints] = createSignal<
          PointIdentityType[]
        >([]);
        return {
          ...data,
          selected,
          setSelected,
          associatedPoints,
          setAssociatedPoints,
        } as PointInterface;
      })
  );
}

export interface PointsEtablissementProps {
  leafletMap: L.Map;
  mapId: number;
  items?: PointInterface[];
}

export const [etablissements, setEtablissements] = createSignal<
  PointInterface[]
>([]);

// TODO: check if necessary (similar feature already existing !)
export const [pointsEtablissementReady, setPointsEtablissementReady] =
  createSignal(false);

export default function (props: PointsEtablissementProps) {
  onMount(async () => {
    let etablissements;

    if (!props.items) {
      etablissements = PointBack2Front(
        await fetchSchool(props.mapId)
      ) as PointInterface[];
    } else {
      etablissements = props.items;
    }
    setEtablissements(etablissements);
    setPointsEtablissementReady(true);
  });

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
    <For each={etablissementFilter()}>
      {(point) => {
        return <PointEtablissement point={point} map={props.leafletMap} />;
      }}
    </For>
  );
}
