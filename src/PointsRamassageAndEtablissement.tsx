import { createSignal, onMount, For, onCleanup } from "solid-js";

import { NatureEnum, PointRamassageType, PointEtablissementType } from "./type";
import Point from "./Point";
import { setPoints, points } from "./signaux";

export default function PointsRamassageAndEtablissement() {
  function fetchPointsRamassage() {
    fetch(import.meta.env.VITE_BACK_URL + "/points_ramassage")
      .then((res) => {
        return res.json();
      })
      .then((data: PointRamassageType[]) => {
        data = data.map((pointRamassage) => ({
          ...pointRamassage,
          nature: NatureEnum.ramassage,
        }));
        setPoints((dataArray) => [...dataArray, ...data]);
      });
    fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement")
      .then((res) => {
        return res.json();
      })
      .then((data: PointEtablissementType[]) => {
        data = data.map((pointEtablissement) => ({
          ...pointEtablissement,
          nature: NatureEnum.etablissement,
        }));
        setPoints((dataArray) => [...dataArray, ...data]);
      });
  }

  onMount(() => {
    fetchPointsRamassage();
  });

  onCleanup(() => {
    setPoints([]);
  });

  return <For each={points()}>{(point) => <Point point={point} />}</For>;
}
