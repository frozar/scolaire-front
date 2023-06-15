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
const [pointsEtablissementReady, setPointsEtablissementReady] =
  createSignal(false);

createEffect(() => {
  if (pointsRamassageReady() && pointsEtablissementReady()) {
    setPointsReady(true);
  }
});

export function fetchPointsRamassage() {
  function addToPoints(data: PointRamassageType[], nature: NatureEnum) {
    const points = data.map((point) => {
      const [selected, setSelected] = createSignal(false);
      return {
        ...point,
        nature,
        selected,
        setSelected,
      };
    });

    setPoints((dataArray) => [...dataArray, ...points]);
  }

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
        setMinMaxQty([
          Math.min(...data.map((value) => value.quantity)),
          Math.max(...data.map((value) => value.quantity)),
        ]);

        addToPoints(data, NatureEnum.ramassage);

        setPointsRamassageReady(true);
      });

    fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement", {
      headers,
    })
      .then((res) => {
        return res.json();
      })
      .then((data: PointEtablissementType[]) => {
        addToPoints(data, NatureEnum.etablissement);

        setPointsEtablissementReady(true);
      });
  });
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
