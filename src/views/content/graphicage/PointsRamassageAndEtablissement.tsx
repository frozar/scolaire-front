import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";
import {
  points,
  setIsEtablissementReady,
  setIsRamassageReady,
  setPoints,
} from "../../../signaux";
import {
  EleveVersEtablissementType,
  NatureEnum,
  PointEtablissementType,
  PointIdentityType,
  PointRamassageType,
} from "../../../type";
import Point from "./Point";
import {
  fetchEleveVersEtablissement,
  fetchSchool,
  fetchStop,
} from "./point.service";

const [, { getActiveMapId }] = useStateGui();

const [, { isInAddLineMode, getLineUnderConstruction }] = useStateAction();

export const [pointsReady, setPointsReady] = createSignal(false);

const [pointsRamassageReady, setPointsRamassageReady] = createSignal(false);
const [pointsEtablissementReady, setPointsEtablissementReady] =
  createSignal(false);

createEffect(() => {
  if (pointsRamassageReady() && pointsEtablissementReady()) {
    setPointsReady(true);
  }
});

type PointRamassageDBType = {
  id: number;
  id_point: number;
  nature: NatureEnum;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

type PointEtablissementDBType = PointRamassageDBType;

type PointRamassageCoreType = Omit<PointRamassageDBType, "id_point"> & {
  idPoint: number;
};

export const [blinkingStopPoint, setBlinkingStopPoint] = createSignal<number[]>(
  []
);

// Rename field 'id_point' to 'idPoint'
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

function PointBack2Front<
  T extends PointRamassageDBType | PointEtablissementDBType
>(
  datas: T[],
  nature: NatureEnum
): PointRamassageType[] | PointEtablissementType[] {
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
      // Add "nature"
      .map((data) => ({ ...data, nature }))
  );
}

export async function fetchPointsRamassageAndEtablissement() {
  const mapId = getActiveMapId();
  if (!mapId) return;

  const ramassages: PointRamassageDBType[] = await fetchStop(mapId as number);
  const ramassageWk = PointBack2Front(
    ramassages,
    NatureEnum.ramassage
  ) as PointRamassageType[];

  setPoints((dataArray) => [...dataArray, ...ramassageWk]);
  setPointsRamassageReady(true);

  const etablissements: PointEtablissementDBType[] = await fetchSchool(mapId);
  const etablissementsWk = PointBack2Front(
    etablissements,
    NatureEnum.etablissement
  ) as PointEtablissementType[];
  setPoints((dataArray) => [...dataArray, ...etablissementsWk]);
  setPointsEtablissementReady(true);
}

export default function () {
  onMount(async () => {
    await fetchPointsRamassageAndEtablissement();
    await getEleveVersEtablissement();
  });

  onCleanup(() => {
    setPoints([]);
    setIsRamassageReady(false);
    setIsEtablissementReady(false);
  });

  const filteredPoints = () =>
    points()
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

  //TODO move filters to Ramassage or Etablissement point file
  return (
    <>
      <For each={ramassageFilter()}>
        {(point, i) => {
          return (
            <Point
              point={point}
              isLast={i() === points().length - 1}
              nature={point.nature}
              minQuantity={minQuantity()}
              maxQuantity={maxQuantity()}
            />
          );
        }}
      </For>
      <For each={etablissementFilter()}>
        {(point, i) => {
          return (
            <Point
              point={point}
              isLast={i() === points().length - 1}
              nature={point.nature}
              minQuantity={minQuantity()}
              maxQuantity={maxQuantity()}
            />
          );
        }}
      </For>
    </>
  );
}

function etablissementFilter(): PointRamassageType[] {
  let etablissements = points().filter(
    (value) => value.nature === NatureEnum.etablissement
  );
  if (isInAddLineMode()) {
    const etablissementsSelected =
      getLineUnderConstruction().etablissementSelected;

    if (etablissementsSelected) {
      etablissements = [etablissementsSelected];
    }
  }

  return etablissements;
}

function ramassageFilter(): PointRamassageType[] {
  const etablissment = getLineUnderConstruction().etablissementSelected;

  let ramassages = points().filter(
    (value) => value.nature === NatureEnum.ramassage
  );

  if (isInAddLineMode()) {
    ramassages = ramassages.filter((value) =>
      value
        .associatedPoints()
        .some((elt) => elt.id === (etablissment ? etablissment.id : -1))
    );
  }

  return ramassages;
}

async function getEleveVersEtablissement() {
  const data: EleveVersEtablissementType[] = await fetchEleveVersEtablissement(
    getActiveMapId() as number
  );

  for (const point of points()) {
    const associatedPoints = data.filter(
      (elt) =>
        point.id ===
        (point.nature === NatureEnum.ramassage
          ? elt.ramassage_id
          : elt.etablissement_id)
    );
    point.setAssociatedPoints(
      associatedPoints.map((elt) => {
        const associatedId =
          point.nature === NatureEnum.ramassage
            ? elt.etablissement_id
            : elt.ramassage_id;
        const associatedNature =
          point.nature === NatureEnum.ramassage
            ? NatureEnum.etablissement
            : NatureEnum.ramassage;
        const id_point =
          associatedNature === NatureEnum.etablissement
            ? elt.etablissement_id_point
            : elt.ramassage_id_point;
        return {
          id: associatedId,
          idPoint: id_point,
          nature: associatedNature,
        };
      })
    );
  }
}
