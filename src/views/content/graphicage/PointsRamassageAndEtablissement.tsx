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
const [pointsEtablssementReady, setPointsEtablssementReady] =
  createSignal(false);

createEffect(() => {
  if (pointsRamassageReady() && pointsEtablssementReady()) {
    setPointsReady(true);
  }
});

export function fetchPointsRamassage() {
  authenticateWrap((headers) => {
    setPointsRamassageReady(false);
    setPointsEtablssementReady(false);

    fetch(import.meta.env.VITE_BACK_URL + "/points_ramassage", {
      headers,
    })
      .then((res) => {
        return res.json();
      })
      .then((data: PointRamassageType[]) => {
        // TODO: refactor
        const [selected, setSelected] = createSignal(false);

        data = data.map((pointRamassage) => ({
          ...pointRamassage,
          nature: NatureEnum.ramassage,
          selected,
          setSelected,
        }));
        setMinMaxQty([
          Math.min(...data.map((value) => value.quantity)),
          Math.max(...data.map((value) => value.quantity)),
        ]);
        setPoints((dataArray) => [...dataArray, ...data]);
        setPointsRamassageReady(true);
      });

    fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement", {
      headers,
    })
      .then((res) => {
        return res.json();
      })
      .then((data: PointEtablissementType[]) => {
        // TODO: refactor
        const [selected, setSelected] = createSignal(false);

        data = data.map((pointEtablissement) => ({
          ...pointEtablissement,
          nature: NatureEnum.etablissement,
          selected,
          setSelected,
        }));

        setPoints((dataArray) => [...dataArray, ...data]);
        setPointsEtablssementReady(true);
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
