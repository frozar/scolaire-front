import L, { LeafletMouseEvent } from "leaflet";
import { For, createEffect, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
// TODO: Déplacer PointRamassageType, PointIdentityType et selectPointById ici ?
// Vérifier tout les imports
import {
  NatureEnum,
  PointIdentityType,
  PointRamassageType,
} from "../../../../../type";
import { linkMap, selectPointById } from "../../Point";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchStop } from "../../point.service";
import PointRamassage from "../molecule/PointRamassage";

type PointRamassageDBType = {
  id: number;
  id_point: number;
  nature: NatureEnum;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

export interface RamassagePointsProps {
  mapId: number;
  map: L.Map;
  isBlinking?: boolean;
}

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
): PointRamassageType[] {
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
        } as PointRamassageType;
      })
  );
}

export default function (props: RamassagePointsProps) {
  console.log("debut RamassagePoints");

  // TODO: Finalité => Utiliser pointRamassageType !!
  // Faire pareil pour composant enfants
  const [ramassage, setRamassage] = createSignal<PointRamassageType[]>([]);

  onMount(async () => {
    const ramassages = PointBack2Front(
      await fetchStop(props.mapId)
    ) as PointRamassageType[];

    setRamassage(ramassages);
    console.log("onMount iciii", ramassage());
  });

  const filteredPoints = () =>
    ramassage()
      .filter((value) => Number.isFinite(value.quantity))
      .map((value) => value.quantity);

  const minQuantity = () => {
    const minCandidat = Math.min(...filteredPoints());
    return Number.isFinite(minCandidat) ? minCandidat : 0;
  };

  const maxQuantity = () => {
    const maxCandidat = Math.max(...filteredPoints());
    return Number.isFinite(maxCandidat) ? maxCandidat : 0;
  };

  function onDBLClick(event: LeafletMouseEvent) {
    L.DomEvent.stopPropagation(event);
  }
  function onClick(pointRamassage: PointRamassageType) {
    if (!isInAddLineMode()) {
      deselectAllBusLines();
      selectPointById(pointRamassage.idPoint);
      return;
    }

    const pointIdentity: PointIdentityType = {
      id: pointRamassage.id,
      idPoint: pointRamassage.idPoint,
      nature: pointRamassage.nature,
    };

    addPointToLineUnderConstruction(pointIdentity);

    if (!(1 < getLineUnderConstruction().stops.length)) {
      return;
    }
    // Highlight point ramassage
    for (const associatedPoint of pointRamassage.associatedPoints()) {
      let element;
      if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
        renderAnimation(element);
      }
    }
  }
  // function onMouseOver() {
  //   // Mettre à jour les points à blinker
  //   // ...
  // }
  // function onMouseOut() {
  //   // Mettre à jour les points à blinker (vider)
  //   // ...
  // }

  createEffect(() => {
    console.log("ramassagePoints createEffect", ramassage());
    // Update isBlinking
  });
  return (
    <For each={ramassage()}>
      {(point, i) => {
        const onIsLast = () => "";
        // const onClick = () => "";
        const onMouseOver = () => "";
        const onMouseOut = () => "";
        console.log(point);

        return (
          // TODO: Utiliser PointRamassageType plutot !
          // Pour pas avoir à passer autant de props
          <PointRamassage
            idPoint={point.id}
            lat={point.lat}
            lon={point.lon}
            map={props.map}
            isLast={i() === ramassage().length - 1}
            isBlinking={false}
            quantity={point.quantity}
            minQuantity={minQuantity()}
            maxQuantity={maxQuantity()}
            onIsLast={onIsLast}
            onClick={() => onClick(point)}
            onDBLClick={onDBLClick}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
          />
        );
      }}
    </For>
  );
}
