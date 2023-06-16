import { createSignal, onMount, For, onCleanup, createEffect } from "solid-js";

import { NatureEnum, PointRamassageType } from "../../../type";
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
  function addToPoints(
    data: {
      id: number;
      id_point: number;
      location: string;
      name: string;
      quantity: number;
    }[],
    nature: NatureEnum
  ) {
    const points = data.map((point) => {
      const [selected, setSelected] = createSignal(false);

      return {
        id: point.id,
        idPoint: point.id_point,
        location: point.location,
        name: point.name,
        quantity: point.quantity,
        nature,
        selected,
        setSelected,
      } as PointRamassageType;
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
      .then(
        (
          res: {
            id: number;
            id_point: number;
            nature: NatureEnum;
            location: string;
            name: string;
            quantity: number;
          }[]
        ) => {
          setMinMaxQty([
            Math.min(...res.map((value) => value.quantity)),
            Math.max(...res.map((value) => value.quantity)),
          ]);

          addToPoints(res, NatureEnum.ramassage);

          setPointsRamassageReady(true);
        }
      );

    fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement", {
      headers,
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (
          res: {
            id: number;
            id_point: number;
            nature: NatureEnum;
            location: string;
            name: string;
            quantity: number;
          }[]
        ) => {
          addToPoints(res, NatureEnum.etablissement);

          setPointsEtablissementReady(true);
        }
      );
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
