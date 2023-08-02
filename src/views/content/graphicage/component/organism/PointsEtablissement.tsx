import L, { LeafletMouseEvent } from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum } from "../../../../../type";
// import { linkMap } from "../../Point";
// import {
//   blinkingStopPoint,
//   setBlinkingStopPoint,
// } from "../../PointsRamassageAndEtablissement";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchSchool } from "../../point.service";
import { PointIdentityType, PointInterface } from "../atom/Point";
import PointEtablissement from "../molecule/PointEtablissement";
import {
  blinkingStopPoint,
  linkMap,
  setBlinking,
  setBlinkingPoint,
  setBlinkingStopPoint,
} from "./Points";
import { PointRamassageDBType } from "./PointsRamassage";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
    setLineUnderConstruction,
  },
] = useStateAction();

// working
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
  map: L.Map;
  mapId: number;
  items?: PointInterface[];
}

export const [etablissements, setEtablissements] = createSignal<
  PointInterface[]
>([]);
// Working
// TODO: check if necessary (similar feature already existing !)
export const [pointsEtablissementReady, setPointsEtablissementReady] =
  createSignal(false);

export const addBlinking = (id: number) => {
  setBlinkingStopPoint([...blinkingStopPoint(), id]);
};

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

  const onClick = (point: PointInterface) => {
    if (!isInAddLineMode()) {
      deselectAllBusLines();
      selectPointById(point.idPoint);
      return;
    }

    const etablissementSelected =
      getLineUnderConstruction().etablissementSelected;

    if (!getLineUnderConstruction().confirmSelection) {
      if (etablissementSelected?.find((p) => p.idPoint === point.idPoint)) {
        return;
      }
      setLineUnderConstruction({
        ...getLineUnderConstruction(),
        etablissementSelected: !etablissementSelected
          ? [point]
          : etablissementSelected.concat(point),
      });

      return;
    }

    // TODO: check how manage line underconstuction with ramassages/etablissement signals
    addPointToLineUnderConstruction({
      id: point.id,
      idPoint: point.idPoint,
      nature: NatureEnum.etablissement,
    });

    if (!(1 < getLineUnderConstruction().stops.length)) {
      return;
    }

    // TODO: check utility
    // Highlight point ramassage
    for (const associatedPoint of point.associatedPoints()) {
      let element;
      if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
        renderAnimation(element);
      }
    }
  };

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

    let etablissementsToReturn = etablissements();

    if (isInAddLineMode()) {
      const etablissementsSelected =
        getLineUnderConstruction().etablissementSelected;

      if (isValidate && etablissementsSelected) {
        etablissementsToReturn = etablissements().filter((value) =>
          etablissementsSelected.some(
            (etablissementInfo) => etablissementInfo.idPoint === value.idPoint
          )
        );
      }
    }
    return etablissementsToReturn as PointInterface[];
  }

  return (
    <For each={etablissementFilter()}>
      {(point) => {
        return (
          <PointEtablissement
            point={point}
            map={props.map}
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
