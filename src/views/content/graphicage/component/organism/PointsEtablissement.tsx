import L, { LeafletMouseEvent } from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum } from "../../../../../type";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchSchool } from "../../point.service";
import { PointIdentityType, PointInterface } from "../atom/Point";
import PointEtablissement from "../molecule/PointEtablissement";
import { deselectAllPoints, setBlinking, setBlinkingPoint } from "./Points";
import { PointRamassageDBType } from "./PointsRamassage";

const [
  ,
  { getLineUnderConstruction, isInAddLineMode, setLineUnderConstruction },
] = useStateAction();

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

  const selectPointById = (id: number) =>
    etablissements().map((point) => point.setSelected(id == point.idPoint));

  function onClick(point: PointInterface) {
    // Select the current element to display information

    if (!isInAddLineMode()) {
      deselectAllBusLines();
      deselectAllPoints();
      selectPointById(point.idPoint);
      return;
    }

    //TODO : move to PointEtablissement in click handler when used

    const etablissementSelected =
      getLineUnderConstruction().etablissementSelected;

    const currentStops = [...getLineUnderConstruction().stops];

    if (getLineUnderConstruction().confirmSelection) {
      const pointIdentity = {
        id: point.id,
        idPoint: point.idPoint,
        nature: NatureEnum.etablissement,
      };

      const index = getLineUnderConstruction().nextIndex;

      currentStops.splice(index, 0, pointIdentity);
    }

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      etablissementSelected: !etablissementSelected
        ? [point]
        : etablissementSelected.concat(point),
      stops: currentStops,
      nextIndex: currentStops.length,
    });

    return;
  }

  const onDBLClick = (event: LeafletMouseEvent) => {
    L.DomEvent.stopPropagation(event);
  };

  const onMouseOver = (point: PointInterface) => {
    setBlinking(point.associatedPoints);
  };

  const onMouseOut = () => {
    setBlinkingPoint([]);
  };

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
        return (
          <PointEtablissement
            point={point}
            map={props.leafletMap}
            onClick={() => onClick(point)}
            onDBLClick={onDBLClick}
            onMouseOver={() => onMouseOver(point)}
            onMouseOut={() => onMouseOut()}
          />
        );
      }}
    </For>
  );
}
