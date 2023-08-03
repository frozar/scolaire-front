import L, { LeafletMouseEvent } from "leaflet";
import { For, createSignal, onMount } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { NatureEnum, PointIdentityType } from "../../../../../type";
import { fetchStop } from "../../point.service";
import { PointInterface } from "../atom/Point";
import PointRamassage from "../molecule/PointRamassage";

const [, { getLineUnderConstruction, isInAddLineMode }] = useStateAction();

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
  leafletMap: L.Map;
  mapId: number;
  onDBLClick: (event: LeafletMouseEvent) => void;
  items?: PointInterface[];
}

export const [ramassages, setRamassages] = createSignal<PointInterface[]>([]);

// TODO: check if necessary (similar feature already existing !)
export const [pointsRamassageReady, setPointsRamassageReady] =
  createSignal(false);

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

  return (
    <For each={ramassageFilter()}>
      {(point) => {
        return (
          <PointRamassage
            point={point}
            map={props.leafletMap}
            onDBLClick={props.onDBLClick}
            minQuantity={minQuantity()}
            maxQuantity={maxQuantity()}
          />
        );
      }}
    </For>
  );
}

// TODO to improve
export function ramassageFilter(): PointInterface[] {
  const etablissement = getLineUnderConstruction().etablissementSelected;
  const isValidate = getLineUnderConstruction().confirmSelection;

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
