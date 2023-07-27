import L, { LeafletMouseEvent } from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum, PointEtablissementType } from "../../../../../type";
import { linkMap } from "../../Point";
import { PointEtablissementDBType } from "../../PointsRamassageAndEtablissement";
import { setPointsEtablissementReady } from "../../PointsRamassageAndEtablissement.working";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchSchool } from "../../point.service";
import { PointIdentityType, PointInterface } from "../atom/Point";
import PointEtablissement from "../molecule/PointEtablissement";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

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
  mapID: number;
  items?: PointInterface[];
}

export const [etablissements, setEtablissement] = createSignal<
  PointInterface[]
>([]);

export const [blinkingStopPoint, setBlinkingStopPoint] = createSignal<number[]>(
  []
);

export const addBlinking = (id: number) => {
  setBlinkingStopPoint([...blinkingStopPoint(), id]);
};

export default function (props: PointsEtablissementProps) {
  onMount(async () => {
    let etablissements;

    if (!props.items) {
      etablissements = PointBack2Front(
        await fetchSchool(props.mapID)
      ) as PointEtablissementType[];
    } else {
      etablissements = props.items;
    }
    setEtablissement(etablissements);
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
    for (const associatedPoint of point.associatedPoints()) {
      addBlinking(associatedPoint.idPoint);
    }
  };

  const onMouseOut = () => {
    setBlinkingStopPoint([]);
  };

  return (
    <For each={etablissements()}>
      {(point, i) => {
        const onIsLast = () => "";

        return (
          <PointEtablissement
            point={point}
            map={props.map}
            isLast={i() === etablissements().length - 1}
            onIsLast={onIsLast}
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
