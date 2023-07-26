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
import { linkMap } from "../../Point";
import { setPointsEtablissementReady } from "../../PointsRamassageAndEtablissement";
import { renderAnimation } from "../../animation";
import { deselectAllBusLines } from "../../line/busLinesUtils";
import { fetchStop } from "../../point.service";
import PointRamassage from "../molecule/PointRamassage";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

type PointRamassageDBType = {
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

export interface RamassagePointsProps {
  map: L.Map;
  mapId: number;
}

// TODO: Finalité => Utiliser pointRamassageType !!
// (et pas la longue liste de props)

const [ramassage, setRamassage] = createSignal<PointRamassageType[]>([]);

export default function (props: RamassagePointsProps) {
  console.log("debut RamassagePoints");

  onMount(async () => {
    const ramassages = PointBack2Front(
      await fetchStop(props.mapId)
    ) as PointRamassageType[];

    setRamassage(ramassages);
    setPointsEtablissementReady(true);
    console.log("onMount iciii", ramassage());
  });

  const selectPointById = (id: number) =>
    ramassage().map((point) => point.setSelected(id == point.idPoint));

  function onClick(point: PointRamassageType) {
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

  // Working --

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
