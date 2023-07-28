import L, { LeafletMouseEvent } from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum, PointIdentityType } from "../../../../../type";
import { linkMap } from "../../Point";
import {
  PointRamassageDBType,
  blinkingStopPoint,
  setBlinkingStopPoint,
  setPointsEtablissementReady,
} from "../../PointsRamassageAndEtablissement";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchStop } from "../../point.service";
import { PointInterface } from "../atom/Point";
import PointRamassage from "../molecule/PointRamassage";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

type PointRamassageCoreType = Omit<PointRamassageDBType, "id_point"> & {
  idPoint: number;
};

function PointBack2FrontIdPoint(
  data: PointRamassageDBType
): PointRamassageCoreType {
  const dataWk = {
    ...data,
    idPoint: data.id_point,
  } as PointRamassageCoreType & { id_point?: number };
  delete dataWk["id_point"];

  console.assert(dataWk["idPoint"] != undefined, "idPoint is undefined");

  return dataWk;
}

function PointBack2Front<T extends PointRamassageDBType>(
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

export interface RamassagePointsProps {
  map: L.Map;
  mapId: number;
  items?: PointInterface[];
}

const [ramassage, setRamassage] = createSignal<PointInterface[]>([]);

export const addBlinking = (id: number) => {
  setBlinkingStopPoint([...blinkingStopPoint(), id]);
};
export default function (props: RamassagePointsProps) {
  onMount(async () => {
    let ramassages;

    if (!props.items) {
      ramassages = PointBack2Front(
        await fetchStop(props.mapId)
      ) as PointInterface[];
    } else {
      ramassages = props.items;
    }

    setRamassage(ramassages);
    setPointsEtablissementReady(true);
  });

  const selectPointById = (id: number) =>
    ramassage().map((point) => point.setSelected(id == point.idPoint));

  function onClick(point: PointInterface) {
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
      nature: NatureEnum.ramassage,
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
  }

  function onDBLClick(event: LeafletMouseEvent) {
    L.DomEvent.stopPropagation(event);
  }

  const onMouseOver = (point: PointInterface) => {
    for (const associatedPoint of point.associatedPoints()) {
      addBlinking(associatedPoint.idPoint);
    }
  };

  const onMouseOut = () => {
    setBlinkingStopPoint([]);
  };

  // function onIsLast(nature: NatureEnum) {
  //   if (nature === NatureEnum.ramassage) {
  //     setIsRamassageReady(true);
  //   } else {
  //     setIsEtablissementReady(true);
  //   }
  // }

  const filteredPoints = () => {
    const datas = ramassage()
      .filter((value) => Number.isFinite(value.quantity))
      .map((value) => value.quantity) as number[];
    return datas;
  };

  const minQuantity = () => {
    const minCandidat = Math.min(...filteredPoints());
    return Number.isFinite(minCandidat) ? minCandidat : 0;
  };

  const maxQuantity = () => {
    const maxCandidat = Math.max(...filteredPoints());
    return Number.isFinite(maxCandidat) ? maxCandidat : 0;
  };

  return (
    <For each={ramassage()}>
      {(point, i) => {
        const onIsLast = () => "";
        return (
          <PointRamassage
            point={point}
            map={props.map}
            isLast={i() === ramassage().length - 1}
            quantity={point.quantity as number}
            minQuantity={minQuantity()}
            maxQuantity={maxQuantity()}
            onIsLast={() => onIsLast()}
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
