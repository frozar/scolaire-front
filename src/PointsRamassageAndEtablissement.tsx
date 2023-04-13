import { createSignal, onMount, For, onCleanup } from "solid-js";

import { NatureEnum, PointRamassageType, PointEtablissementType } from "./type";
import Point from "./Point";
import { setPoints, points } from "./signaux";

export default function PointsRamassageAndEtablissement() {
  function mapCircleSize(data: PointRamassageType[]) {
    var pupils_qty_list: number[] = [];
    for (let point_ramassage of data) {
      pupils_qty_list.push(point_ramassage.pupils_qty);
    }
    // Normalization
    const maxQtyValue = Math.max(...pupils_qty_list);
    const minQtyValue = Math.min(...pupils_qty_list);
    const normalizedData = pupils_qty_list.map(
      (value) => (value - minQtyValue) / (maxQtyValue - minQtyValue)
    );
    // Scalling
    const minSizeValue = 25;
    const maxSizeValue = 75;
    const range = maxSizeValue - minSizeValue;
    const mappedValues = normalizedData.map(
      (value) => value * range + minSizeValue
    );
    // Save circle_size values
    for (let i in data) {
      data[i].circle_size = mappedValues[i];
    }
    return data;
  }
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
        data = mapCircleSize(data);
        setPoints(() => [...data]);
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
