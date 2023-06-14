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
      .then((data: PointRamassageType[]) => {
        // refactor ??
        setMinMaxQty([
          Math.min(...data.map((value) => value.quantity)), // diff
          Math.max(...data.map((value) => value.quantity)), // diff
        ]);

        const points = mapData(data, NatureEnum.ramassage);
        setPoints((dataArray) => [...dataArray, ...points]);

        setPointsRamassageReady(true); // diff
      });

    fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement", {
      headers,
    })
      .then((res) => {
        return res.json();
      })
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
  const points = data.map((point) => {
    const [selected, setSelected] = createSignal(false);
    return {
      ...point,
      nature,
      selected,
      setSelected,
    };
  });
  return points;
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
