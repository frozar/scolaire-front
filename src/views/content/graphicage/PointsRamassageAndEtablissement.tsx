import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { useStateGui } from "../../../StateGui";
import {
  points,
  setIsEtablissementReady,
  setIsRamassageReady,
  setPoints,
} from "../../../signaux";
import {
  NatureEnum,
  PointEtablissementType,
  PointRamassageType,
} from "../../../type";
import { authenticateWrap } from "../../layout/topMenu/authentication";
import Point from "./Point";

const [, { getActiveMapId }] = useStateGui();

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
  location: string;
  name: string;
  quantity: number;
};

type PointEtablissementDBType = PointRamassageDBType;

type PointRamassageCoreType = Omit<PointRamassageDBType, "id_point"> & {
  idPoint: number;
};

function PointBack2FrontIdPoint(
  data: PointRamassageDBType
): PointRamassageCoreType {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id_point: _, ...dataWk } = { ...data, idPoint: data.id_point };
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
        return { ...data, selected, setSelected } as PointRamassageType;
      })
      // Add "nature"
      .map((data) => ({ ...data, nature }))
  );
}

export function fetchPointsRamassageAndEtablissement() {
  authenticateWrap((headers) => {
    setPointsRamassageReady(false);
    setPointsEtablissementReady(false);

    fetch(import.meta.env.VITE_BACK_URL + "/points_ramassage", {
      headers,
    }).then(async (res) => {
      const datas: PointRamassageDBType[] = await res.json();

      const dataWk = PointBack2Front(
        datas,
        NatureEnum.ramassage
      ) as PointRamassageType[];

      setPoints((dataArray) => [...dataArray, ...dataWk]);

      setPointsRamassageReady(true);
    });

    const mapId = getActiveMapId();
    if (mapId) {
      fetch(import.meta.env.VITE_BACK_URL + `/map/${mapId}/etablissements`, {
        headers,
      }).then(async (res) => {
        const json = await res.json();

        const datas: PointEtablissementDBType[] = json["content"];

        const dataWk = PointBack2Front(
          datas,
          NatureEnum.etablissement
        ) as PointEtablissementType[];

        console.log("dataWk", dataWk);
        setPoints((dataArray) => [...dataArray, ...dataWk]);

        setPointsEtablissementReady(true);
      });
    }
  });
}

export default function () {
  onMount(() => {
    fetchPointsRamassageAndEtablissement();
  });

  onCleanup(() => {
    setPoints([]);
    setIsRamassageReady(false);
    setIsEtablissementReady(false);
  });

  return (
    <For each={points()}>
      {(point, i) => (
        <Point
          point={point}
          isLast={i() === points().length - 1}
          nature={point.nature}
          minQuantity={Math.min(...points().map((value) => value.quantity))}
          maxQuantity={Math.max(...points().map((value) => value.quantity))}
        />
      )}
    </For>
  );
}
