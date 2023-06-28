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
import { authenticateWrap } from "../../layout/authentication";
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
  // location: string;
  lon: number;
  lat: number;
  name: string;
  quantity: number;
};

type PointEtablissementDBType = PointRamassageDBType;

type PointRamassageCoreType = Omit<PointRamassageDBType, "id_point"> & {
  idPoint: number;
};

// Rename field 'id_point' to 'idPoint'
function PointBack2FrontIdPoint(
  data: PointRamassageDBType
): PointRamassageCoreType {
  // console.log("data", data);
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

    const mapId = getActiveMapId();

    if (mapId) {
      fetch(
        import.meta.env.VITE_BACK_URL + `/map/${mapId}/dashboard/ramassages`,
        {
          headers,
        }
      ).then(async (res) => {
        const json = await res.json();
        // console.log("json", json);

        const datas: PointRamassageDBType[] = json["content"];
        // console.log("datas", datas);

        const dataWk = PointBack2Front(
          datas,
          NatureEnum.ramassage
        ) as PointRamassageType[];
        console.log("Ramassage: dataWk", dataWk);

        setPoints((dataArray) => [...dataArray, ...dataWk]);

        setPointsRamassageReady(true);
      });

      fetch(
        import.meta.env.VITE_BACK_URL +
          `/map/${mapId}/dashboard/etablissements`,
        {
          headers,
        }
      ).then(async (res) => {
        const json = await res.json();

        const datas: PointEtablissementDBType[] = json["content"];

        const dataWk = PointBack2Front(
          datas,
          NatureEnum.etablissement
        ) as PointEtablissementType[];
        console.log("Etablissement: dataWk", dataWk);

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

  return (
    <For each={points()}>
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
  );
}
