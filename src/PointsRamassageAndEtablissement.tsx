import { createSignal, onMount, For, onCleanup } from "solid-js";

import { NatureEnum, PointRamassageType, PointEtablissementType } from "./type";
import Point from "./Point";
import { setPoints, points } from "./signaux";
import { getToken } from "./auth/auth";

export const [minMaxQty, setMinMaxQty] = createSignal([1, 100]);
export const [pointsReady, setPointsReady] = createSignal(false);

export function fetchPointsRamassage() {
  getToken()
    .then((token) => {
      fetch(import.meta.env.VITE_BACK_URL + "/points_ramassage", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data: PointRamassageType[]) => {
          data = data.map((pointRamassage) => ({
            ...pointRamassage,
            nature: NatureEnum.ramassage,
          }));
          setMinMaxQty([
            Math.min(...data.map((value) => value.quantity)),
            Math.max(...data.map((value) => value.quantity)),
          ]);
          setPoints((dataArray) => [...dataArray, ...data]);
        });
      fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data: PointEtablissementType[]) => {
          data = data.map((pointEtablissement) => ({
            ...pointEtablissement,
            nature: NatureEnum.etablissement,
          }));
          setPoints((dataArray) => [...dataArray, ...data]);
          setPointsReady(true);
        });
    })
    .catch((err) => {
      console.log(err);
    });
}
export default function () {
  onMount(async () => {
    fetchPointsRamassage();
  });

  onCleanup(() => {
    setPoints([]);
  });

  return (
    <For each={points()}>{(point, i) => <Point point={point} nb={i()} />}</For>
  );
}
