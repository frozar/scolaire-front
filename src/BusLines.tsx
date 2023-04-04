import { createSignal, onMount, For, onCleanup } from "solid-js";

import { Line, NatureEnum, PointIdentity } from "./type";
import LineDisplay from "./LineDisplay";

export default function BusLines() {
  const [busLines, setBusLines] = createSignal<Line[]>([]);

  function fetchBusLines() {
    fetch(import.meta.env.VITE_BACK_URL + "/bus_lines")
      .then((res) => {
        return res.json();
      })
      .then(
        (
          res: {
            id_bus_line: number;
            stops: {
              id: number;
              point_id: number;
              nature: string;
            }[];
          }[]
        ) => {
          let lines: Line[] = res.map((line) => {
            const stopsWithNatureEnum = line.stops.map(
              (stop) =>
                ({
                  ...stop,
                  nature:
                    stop["nature"] === "ramassage"
                      ? NatureEnum.ramassage
                      : NatureEnum.etablissement,
                } as PointIdentity)
            );
            return { ...line, stops: stopsWithNatureEnum };
          });

          setBusLines(lines);
        }
      );
  }

  onMount(() => {
    fetchBusLines();
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <For each={busLines()}>{(line) => <LineDisplay line={line} />}</For>;
}
