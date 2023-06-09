import { onCleanup, createEffect } from "solid-js";
import {
  getLeafletMap,
  linkBusLinePolyline,
  setBusLines,
} from "../../../../signaux";
import { pointsReady } from "../../../../views/content/graphicage/PointsRamassageAndEtablissement";
import { getToken } from "../../../layout/topMenu/authentication";
import { LineType, NatureEnum, PointIdentityType } from "../../../../type";
import {
  computePolyline,
  computeArrows,
  busLinePolylineAttachEvent,
  arrowAttachEvent,
} from "./BusLinesFunction";

function randColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

export function fetchBusLines() {
  getToken()
    .then((token) => {
      fetch(import.meta.env.VITE_BACK_URL + "/bus_lines", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then(
          (
            res: {
              id_bus_line: number;
              color: string | null;
              stops: {
                id: number;
                id_point: number;
                nature: string;
              }[];
            }[]
          ) => {
            const lines: LineType[] = res.map((resLine) => {
              const color = resLine.color ? "#" + resLine.color : randColor();
              const stopsWithNatureEnum = resLine.stops.map(
                (stop) =>
                  ({
                    ...stop,
                    nature:
                      stop["nature"] === "ramassage"
                        ? NatureEnum.ramassage
                        : NatureEnum.etablissement,
                  } as PointIdentityType)
              );

              const lineWk: LineType = {
                idBusLine: resLine.id_bus_line,
                color: color,
                stops: stopsWithNatureEnum,
              };

              return lineWk;
            });

            setBusLines((previousLines) => {
              // Remove existing polylines and arrows
              const idLines = lines.map((line) => line.idBusLine);

              for (const previousLine of previousLines) {
                if (
                  !(previousLine.idBusLine in idLines) &&
                  linkBusLinePolyline[previousLine.idBusLine]
                ) {
                  const { polyline: previousPolyline, arrows: previousArrows } =
                    linkBusLinePolyline[previousLine.idBusLine];

                  previousPolyline.remove();
                  previousArrows.map((arrow) => arrow.remove());

                  delete linkBusLinePolyline[previousLine.idBusLine];
                }
              }

              for (const line of lines) {
                // 1. Calcul de la polyline, à vol d'oiseau ou sur route
                computePolyline(line.color, line.stops).then(
                  (busLinePolyline) => {
                    const polylineLatLngs =
                      busLinePolyline.getLatLngs() as L.LatLng[];
                    // 2. Calcul des fléches
                    const arrows = computeArrows(polylineLatLngs, line.color);

                    // 3.Attacher les events
                    busLinePolylineAttachEvent(
                      busLinePolyline,
                      line.idBusLine,
                      arrows
                    );

                    for (const arrow of arrows) {
                      arrowAttachEvent(
                        arrow,
                        busLinePolyline,
                        line.idBusLine,
                        arrows
                      );
                    }

                    // 4. Manage the display of buslines
                    if (line.idBusLine in linkBusLinePolyline) {
                      const {
                        polyline: previousPolyline,
                        arrows: previousArrows,
                      } = linkBusLinePolyline[line.idBusLine];
                      previousPolyline.remove();
                      previousArrows.map((arrow) => arrow.remove());
                    }

                    const leafletMap = getLeafletMap();
                    if (!leafletMap) {
                      delete linkBusLinePolyline[line.idBusLine];
                      return;
                    }

                    busLinePolyline.addTo(leafletMap);
                    for (const arrow of arrows) {
                      arrow.addTo(leafletMap);
                    }

                    // 5. Enregistrer dans linkBusLinePolyline
                    linkBusLinePolyline[line.idBusLine] = {
                      polyline: busLinePolyline,
                      arrows: arrows,
                      color: line.color,
                    };
                  }
                );
              }

              return lines;
            });
          }
        );
    })
    .catch((err) => {
      console.log(err);
    });
}
export default function () {
  createEffect(() => {
    if (pointsReady()) {
      fetchBusLines();
    }
  });

  onCleanup(() => {
    setBusLines([]);
  });

  return <></>;
}
