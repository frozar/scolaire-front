import L, { LeafletMouseEvent } from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  NatureEnum,
  PointEtablissementType,
  PointIdentityType,
} from "../../../../../type";
import { linkMap } from "../../Point";
import { setPointsEtablissementReady } from "../../PointsRamassageAndEtablissement";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchSchool } from "../../point.service";
import PointEtablissement from "../molecule/PointEtablissement";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

type PointEtablissementDBType = {
  id: number;
  id_point: number;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

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

  console.assert(dataWk["idPoint"] != undefined, "idPoint is undefined");

  return dataWk;
}

function PointBack2Front<T extends PointEtablissementDBType>(
  datas: T[]
): PointEtablissementType[] {
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
        } as PointEtablissementType;
      })
  );
}

export interface PointsEtablissementProps {
  map: L.Map;
  mapID: number;
}

export const [etablissements, setEtablissement] = createSignal<
  PointEtablissementType[]
>([]);

export default function (props: PointsEtablissementProps) {
  onMount(async () => {
    const etablissements = PointBack2Front(
      await fetchSchool(props.mapID)
    ) as PointEtablissementType[];
    setEtablissement(etablissements);
    setPointsEtablissementReady(true);
  });

  const selectPointById = (id: number) =>
    etablissements().map((point) => point.setSelected(id == point.idPoint));

  const onClick = (point: PointEtablissementType) => {
    if (!isInAddLineMode()) {
      deselectAllBusLines();
      selectPointById(point.idPoint);
      return;
    }

    // TODO: when add line with an etablissement point the line destroy after next point click
    // Wait Richard/Hugo finish the line underconstruction
    addPointToLineUnderConstruction({
      id: point.id,
      idPoint: point.idPoint,
      nature: NatureEnum.etablissement,
    });

    if (!(1 < getLineUnderConstruction().stops.length)) {
      return;
    }

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

  const onMouseOver = (point: PointEtablissementType) => {
    for (const associatedPoint of point.associatedPoints()) {
      const element = linkMap.get(associatedPoint.idPoint)?.getElement();
      const { nature } = associatedPoint;
      const className =
        nature === NatureEnum.ramassage
          ? "circle-animation-ramassage"
          : "circle-animation-etablissement";
      if (element) {
        element.classList.add(className);
      }
    }
  };

  const onMouseOut = (point: PointEtablissementType) => {
    for (const associatedPoint of point.associatedPoints()) {
      const element = linkMap.get(associatedPoint.idPoint)?.getElement();
      const { nature } = associatedPoint;
      const className =
        nature === NatureEnum.ramassage
          ? "circle-animation-ramassage"
          : "circle-animation-etablissement";

      if (element) {
        element.classList.remove(className);
      }
    }
  };

  return (
    <For each={etablissements()}>
      {(point, i) => {
        const onIsLast = () => "";

        return (
          <PointEtablissement
            idPoint={point.idPoint}
            lat={point.lat}
            lon={point.lon}
            map={props.map}
            isLast={i() === etablissements().length - 1}
            isBlinking={false}
            onIsLast={onIsLast}
            onClick={() => onClick(point)}
            onDBLClick={onDBLClick}
            onMouseOver={() => onMouseOver(point)}
            onMouseOut={() => onMouseOut(point)}
          />
        );
      }}
    </For>
  );
}
