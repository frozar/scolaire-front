import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";

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
import { authenticateWrap } from "../../layout/authentication";
import Point from "./Point";
import { fetchSchool } from "./point.service";

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
  const datas: PointRamassageDBType[] = await fetchSchool(mapId as number);
  const dataWk = PointBack2Front(
    datas,
    NatureEnum.ramassage
  ) as PointRamassageType[];
  setPoints((dataArray) => [...dataArray, ...dataWk]);

  authenticateWrap((headers) => {
    setPointsRamassageReady(false);
    setPointsEtablissementReady(false);

    if (mapId) {
      // fetch(
      //   import.meta.env.VITE_BACK_URL + `/map/${mapId}/dashboard/ramassage`,
      //   {
      //     headers,
      //   }
      // ).then(async (res) => {
      //   const json = await res.json();
      //   // console.log("json", json);

      //   const datas: PointRamassageDBType[] = json["content"];
      //   console.log("Ramassage datas", datas);

      //   const dataWk = PointBack2Front(
      //     datas,
      //     NatureEnum.ramassage
      //   ) as PointRamassageType[];
      //   console.log("Ramassage: dataWk", dataWk);

      //   setPoints((dataArray) => [...dataArray, ...dataWk]);

      //   setPointsRamassageReady(true);
      // });

      fetch(
        import.meta.env.VITE_BACK_URL + `/map/${mapId}/dashboard/etablissement`,
        {
          headers,
        }
      ).then(async (res) => {
        const json = await res.json();

        const datas: PointEtablissementDBType[] = json["content"];
        console.log("Etablissement datas", datas);

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
  onMount(async () => {
    fetchPointsRamassageAndEtablissement();
    fetchEleveVersEtablissement();
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

function fetchEleveVersEtablissement() {
  authenticateWrap((headers) => {
    fetch(
      import.meta.env.VITE_BACK_URL +
        "/map/" +
        getActiveMapId() +
        "/eleve_vers_etablissement",
      {
        headers,
      }
    ).then(async (res) => {
      const json = await res.json();

      const data: EleveVersEtablissementType[] = json.content;

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
    });
  });
}
