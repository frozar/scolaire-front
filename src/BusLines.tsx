import { createSignal, onMount, For, onCleanup } from "solid-js";

import {
  NatureEnum,
  PointRamassageType,
  PointEtablissementType,
  Line,
  PointIdentity,
} from "./type";
import Point from "./Point";
import LineDisplay from "./LineDisplay";
import { points } from "./signaux";
import { map } from "lodash";

export default function BusLines() {
  const [busLines, setbusLines] = createSignal<Line[]>([]);

  function fetchBusLines() {
    fetch(import.meta.env.VITE_BACK_URL + "/bus_lines")
      .then((res) => {
        return res.json();
      })
      .then((res: { id_bus_line: number; id_points: number[] }[]) => {
        const lines = res.map((line) => {
          const myline: Line = {
            id: line.id_bus_line,
            stops: line.id_points.map((line_point) => {
              const point = points().find(
                (point) => point.point_id === line_point
              );
              let pointIdentity: PointIdentity = null;
              if (point != null) {
                pointIdentity = {
                  id: point.id,
                  point_id: point.point_id,
                  nature: point.nature,
                };
              }
              return pointIdentity;
            }),
          };
          return myline;
        });

        setbusLines(lines);
      });
    //   .then((data: PointRamassageType[]) => {
    //     data = data.map((pointRamassage) => ({
    //       ...pointRamassage,
    //       nature: NatureEnum.ramassage,
    //     }));
    //     setPoints((dataArray) => [...dataArray, ...data]);
    //   });
    // fetch(import.meta.env.VITE_BACK_URL + "/points_etablissement")
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((data: PointEtablissementType[]) => {
    //     data = data.map((pointEtablissement) => ({
    //       ...pointEtablissement,
    //       nature: NatureEnum.etablissement,
    //     }));
    //     setPoints((dataArray) => [...dataArray, ...data]);
    //   });
  }

  onMount(() => {
    fetchBusLines();
  });

  onCleanup(() => {
    setbusLines([]);
  });

  return <For each={busLines()}>{(line) => <LineDisplay line={line} />}</For>;
}
