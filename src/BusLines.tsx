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
            id: number;
            point_id: number;
            nature: string;
          }[]
        ) => {
          if (res.length === 0) {
            return [];
          }

          // Reconstruct the stop with the NatureEnum
          const piecesOfLine: { id_bus_line: number; stop: PointIdentity }[] =
            res.map((pieceOfLine) => {
              const { id_bus_line, id, point_id, nature } = pieceOfLine;
              const enumNature =
                nature === "ramassage"
                  ? NatureEnum.ramassage
                  : NatureEnum.etablissement;

              return {
                id_bus_line,
                stop: {
                  id,
                  point_id,
                  nature: enumNature,
                } as PointIdentity,
              };
            });

          // Aggregate the different stop by id_bus_line
          let lines: Line[] = [];
          const firstElt = piecesOfLine[0];
          let currentLine: Line = {
            id: firstElt.id_bus_line,
            stops: [firstElt.stop],
          };
          for (const elt of piecesOfLine.slice(1)) {
            const currentIdBusLine = currentLine.id;
            if (elt.id_bus_line === currentIdBusLine) {
              currentLine.stops.push(elt.stop);
            } else {
              lines.push(currentLine);
              currentLine = { id: elt.id_bus_line, stops: [elt.stop] };
            }
          }
          lines.push(currentLine);

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
