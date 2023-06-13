import { createSignal, onMount, For, onCleanup, createEffect } from "solid-js";

import {
  NatureEnum,
  PointRamassageType,
  PointEtablissementType,
} from "../../../type";
import Point from "./Point";
import {
  setPoints,
  points,
  setIsRamassageReady,
  setIsEtablissementReady,
} from "../../../signaux";
import { authenticateWrap } from "../../layout/topMenu/authentication";

export const [minMaxQty, setMinMaxQty] = createSignal([1, 100]);
export const [pointsReady, setPointsReady] = createSignal(false);

const [pointsRamassageReady, setPointsRamassageReady] = createSignal(false);
const [pointsEtablssementReady, setPointsEtablissementReady] =
  createSignal(false);

createEffect(() => {
  if (pointsRamassageReady() && pointsEtablssementReady()) {
    setPointsReady(true);
  }
});

export function fetchPointsRamassage() {
  authenticateWrap((headers) => {
    setPointsRamassageReady(false);
    setPointsEtablissementReady(false);

    fetch(import.meta.env.VITE_BACK_URL + "/points_ramassage", {
      headers,
    })
      .then((res) => {
        return res.json();
      })
      // .then((data: PointRamassageType[]) => {
      //   // diff
      //   // TODO: refactor
      //   data = data.map((pointRamassage) => {
      //     const [selected, setSelected] = createSignal(false);
      //     return {
      //       ...pointRamassage,
      //       nature: NatureEnum.ramassage, // diff
      //       selected,
      //       setSelected,
      //     };
      //   });
      //   setMinMaxQty([
      //     // diff => prob d'être fait après setPoints()
      //     Math.min(...data.map((value) => value.quantity)), // diff
      //     Math.max(...data.map((value) => value.quantity)), // diff
      //   ]);
      //   setPoints((dataArray) => [...dataArray, ...data]);
      //   setPointsRamassageReady(true); // diff
      // });
      .then((data: PointRamassageType[]) => {
        // refactor ??
        const points = mapData(data, NatureEnum.ramassage);
        setMinMaxQty([
          Math.min(...points.map((value) => value.quantity)), // diff
          Math.max(...points.map((value) => value.quantity)), // diff
        ]);
        setPoints((dataArray) => [...dataArray, ...points]);
        setPointsRamassageReady(true); // diff
      });

    fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement", {
      headers,
    })
      .then((res) => {
        return res.json();
      })
      // .then((data: PointEtablissementType[]) => {
      //   // TODO: refactor
      //   data = data.map((pointEtablissement) => {
      //     const [selected, setSelected] = createSignal(false);
      //     return {
      //       ...pointEtablissement,
      //       nature: NatureEnum.etablissement,
      //       selected,
      //       setSelected,
      //     };
      //   });

      //   setPoints((dataArray) => [...dataArray, ...data]);
      //   setPointsEtablssementReady(true);
      // });
      .then((data: PointEtablissementType[]) => {
        // refactor
        const points = mapData(data, NatureEnum.etablissement);

        setPoints((dataArray) => [...dataArray, ...points]);
        setPointsEtablissementReady(true);
      });
  });
}

// rename
function mapData(data: PointRamassageType[], nature: NatureEnum) {
  data = data.map((point) => {
    const [selected, setSelected] = createSignal(false);
    return {
      ...point,
      nature,
      selected,
      setSelected,
    };
  });
  return data;
}

export default function () {
  onMount(() => {
    fetchPointsRamassage();
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
        />
      )}
    </For>
  );
}
