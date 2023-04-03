import { createSignal, onMount, For, onCleanup } from "solid-js";

import { Line, PointIdentity } from "./type";
import LineDisplay from "./LineDisplay";
import { points } from "./signaux";

export default function BusLines() {
  const [busLines, setBusLines] = createSignal<Line[]>([]);

  function fetchBusLines() {
    fetch(import.meta.env.VITE_BACK_URL + "/bus_lines")
      .then((res) => {
        return res.json();
      })
      .then((res: { id_bus_line: number; id_points: number[] }[]) => {
        const lines = res.map((line) => {
          const busStops = line.id_points
            .map((line_id_point) => {
              const point = points().find(
                (point) => point.point_id === line_id_point
              );
              if (point) {
                const { id, point_id, nature } = point;
                return { id, point_id, nature } as PointIdentity;
              } else {
                return null;
              }
            })
            .filter((pointOrNull) => pointOrNull) as PointIdentity[];

          const myLine: Line = {
            id: line.id_bus_line,
            stops: busStops,
          };
          return myLine;
        });
        setBusLines(lines);
      });
  }

  onMount(() => {
    fetchBusLines();
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <For each={busLines()}>{(line) => <LineDisplay line={line} />}</For>;
}
