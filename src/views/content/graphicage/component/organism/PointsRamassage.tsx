import L, { LeafletMouseEvent } from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum, PointIdentityType } from "../../../../../type";
// import { linkMap } from "../../Point";
// import {
//   blinkingStopPoint,
//   setBlinkingStopPoint,
// } from "../../PointsRamassageAndEtablissement";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchStop } from "../../point.service";
import { PointInterface } from "../atom/Point";
import PointRamassage from "../molecule/PointRamassage";
import {
  blinkingStopPoint,
  linkMap,
  setBlinking,
  setBlinkingPoint,
  setBlinkingStopPoint,
} from "./Points";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export type PointRamassageDBType = {
  id: number;
  id_point: number;
  nature: NatureEnum;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

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

export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

// Working
// TODO: check if necessary (similar feature already existing !)
export const [pointsRamassageReady, setPointsRamassageReady] =
  createSignal(false);

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

    setRamassages(ramassages);
    setPointsRamassageReady(true);
  });

  const selectPointById = (id: number) =>
    ramassages().map((point) => point.setSelected(id == point.idPoint));

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
    setBlinking(point.associatedPoints);
  };

  const onMouseOut = () => {
    setBlinkingPoint([]);
  };
  // TODO: Check how to manage onIsLast
  // function onIsLast(nature: NatureEnum) {
  //   if (nature === NatureEnum.ramassage) {
  //     setIsRamassageReady(true);
  //   } else {
  //     setIsEtablissementReady(true);
  //   }
  // }

  const quantities = () => {
    return ramassages()
      .filter((value) => Number.isFinite(value.quantity))
      .map((value) => {
        return value.quantity;
      }) as number[];
  };

  const minQuantity = () => {
    const minCandidat = Math.min(...quantities());
    return Number.isFinite(minCandidat) ? minCandidat : 0;
  };

  const maxQuantity = () => {
    const maxCandidat = Math.max(...quantities());
    return Number.isFinite(maxCandidat) ? maxCandidat : 0;
  };

  function ramassageFilter(): PointInterface[] {
    const etablissement = getLineUnderConstruction().etablissementSelected;
    const isValidate = getLineUnderConstruction().confirmSelection;

    // let ramassages = points().filter(
    //   (value) => value.nature === NatureEnum.ramassage
    // );

    let ramassagesToReturn = ramassages();

    if (isInAddLineMode() && etablissement) {
      ramassagesToReturn = ramassages().filter((value) =>
        value
          .associatedPoints()
          .some((elt) =>
            etablissement.find((e) => e.idPoint === elt.idPoint && isValidate)
          )
      );
    }

    return ramassagesToReturn as PointInterface[];
  }

  return (
    // <For each={ramassages()}>
    //   {(point) => {
    //     return (
    //       <PointRamassage
    //         point={point}
    //         map={props.map}
    //         minQuantity={minQuantity()}
    //         maxQuantity={maxQuantity()}
    //         onClick={() => onClick(point)}
    //         onDBLClick={onDBLClick}
    //         onMouseOver={() => onMouseOver(point)}
    //         onMouseOut={() => onMouseOut()}
    //       />
    //     );
    //   }}
    // </For>
    <For each={ramassageFilter()}>
      {(point) => {
        return (
          <PointRamassage
            point={point}
            map={props.map}
            // isLast={i() === points().length - 1}
            // nature={point.nature}
            minQuantity={minQuantity()}
            maxQuantity={maxQuantity()}
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
