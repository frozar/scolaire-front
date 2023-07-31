import L from "leaflet";

import { LineString } from "geojson";
import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { useStateGui } from "../../../../StateGui";
import {
  getLeafletMap,
  points,
  setRemoveConfirmation,
} from "../../../../signaux";
import {
  EleveVersEtablissementType,
  LineType,
  LineUnderConstructionType,
  NatureEnum,
  PointIdentityType,
} from "../../../../type";
import { authenticateWrap } from "../../../layout/authentication";
import {
  setTotalQuantity,
  totalQuantity,
} from "../component/organism/AddLineInformationBoardContent";
import { deselectAllPoints, linkMap } from "../component/organism/Points";
import { TimelineItemType } from "../informationBoard/Timeline";
import { fetchEleveVersEtablissement } from "../point.service";
import {
  busLines,
  linkBusLinePolyline,
  setBusLines,
  setPickerColor,
} from "./BusLines";

const [, { getActiveMapId }] = useStateGui();
const [, { isInAddLineMode }] = useStateAction();

export function getLatLngs(stops: PointIdentityType[]): L.LatLng[] {
  const latlngs: L.LatLng[] = [];

  // TODO: linkMap must be reactive => signal

  for (const pointIdentity of stops) {
    const circle = linkMap.get(pointIdentity.idPoint);
    if (circle) {
      latlngs.push(circle.getLatLng());
    }
  }

  return latlngs;
}

export function getBusLinePolyline(
  color: string,
  latlngs: L.LatLng[],
  opacity: number
) {
  return L.polyline(latlngs, {
    color: color,
    opacity: opacity,
  }) as L.Polyline<LineString>;
}

function getArrowSVG(color: string, angle: number) {
  return (
    "<svg fill=" +
    color +
    " stroke-width='0' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' height='1em' width='1em' " +
    "style='overflow: visible;'><path d='m12 13.172 4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z' " +
    "transform-origin='12 12' transform='scale(2,2) rotate(" +
    angle +
    ")'></path></svg>"
  );
}

function arrowApplyStyle(arrows: L.Marker[], color: string, transform: string) {
  // Change color
  arrows.map((arrow) => {
    const element = arrow.getElement();
    if (!element) {
      return;
    }
    const elementChild = element.firstElementChild;
    if (!elementChild) {
      return;
    }
    elementChild.setAttribute("fill", color);
  });

  // Change size
  arrows.map((arrow) => {
    const element = arrow.getElement();
    if (!element) {
      return;
    }

    const elementChild = element.firstElementChild;
    if (!elementChild) {
      return;
    }

    const subChild = elementChild.firstElementChild;
    if (!subChild) {
      return;
    }

    // Keep first transformation value which should be a rotation
    const transformValue = subChild.getAttribute("transform");
    const rotation = transformValue;
    if (!rotation) {
      return;
    }

    const rotationValue = rotation.split(" ").at(1);
    const transformModifiedValue = transform + rotationValue;

    subChild.setAttribute("transform", transformModifiedValue);
  });
}

function getBusLineColor(busLines: LineType[], idBusLine: number) {
  const busLine = getBusLineById(busLines, idBusLine);

  if (!busLine) {
    return;
  }

  return busLine.color;
}

function getBusLineById(
  busLines: LineType[],
  idBusLine: number
): LineType | undefined {
  return busLines.find((route) => route.idBusLine == idBusLine);
}

export function deselectAllBusLines() {
  busLines().map((busLine) => busLine.setSelected(false));
}

function selectBusLineById(targetIdBusLine: number) {
  busLines().map((busLine) =>
    busLine.setSelected(targetIdBusLine == busLine.idBusLine)
  );
}

const [, { isInReadMode, isInRemoveLineMode, getLineUnderConstruction }] =
  useStateAction();

function polylineSetBoldStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 8 });
}

function polylineSetNormalStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 3 });
}

function arrowsSetBoldStyle(arrows: L.Marker[], color: string) {
  arrowApplyStyle(arrows, color, "scale(4,4) ");
}

function arrowsSetNormalStyle(arrows: L.Marker[], color: string) {
  arrowApplyStyle(arrows, color, "scale(2,2) ");
}

export function buslineSetBoldStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetBoldStyle(polyline, color);
  arrowsSetBoldStyle(arrowsLinked, color);
}

export function buslineSetNormalStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetNormalStyle(polyline, color);
  arrowsSetNormalStyle(arrowsLinked, color);
}

function handleMouseOver(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  idBusLine: number
) {
  const busLine = getBusLineById(busLines(), idBusLine);
  if (!busLine) {
    return;
  }

  const isSelected = busLine.selected();

  if (!isSelected && (isInRemoveLineMode() || isInReadMode())) {
    buslineSetBoldStyle(polyline, arrowsLinked, "white");
  }
}

function handleMouseOut(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  idBusLine: number
) {
  const busLine = getBusLineById(busLines(), idBusLine);
  if (!busLine) {
    return;
  }

  const isSelected = busLine.selected();

  if (!isSelected && (isInRemoveLineMode() || isInReadMode())) {
    const routeColor = getBusLineColor(busLines(), idBusLine);
    if (!routeColor) {
      return;
    }
    buslineSetNormalStyle(polyline, arrowsLinked, routeColor);
  }
}

function handleClick(idBusLine: number) {
  if (isInRemoveLineMode()) {
    setRemoveConfirmation({
      displayed: true,
      idBusLine: idBusLine,
    });
  }

  if (isInReadMode()) {
    deselectAllPoints();
    selectBusLineById(idBusLine);
  }

  const color = getSelectedBusLine()?.color;
  if (!color) {
    return;
  }

  setPickerColor(color);
}

export function attachEvent(
  self: L.Polyline | L.Marker,
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  idBusLine: number
) {
  self
    .on("mouseover", () => {
      handleMouseOver(polyline, arrowsLinked, idBusLine);
    })
    .on("mouseout", () => {
      handleMouseOut(polyline, arrowsLinked, idBusLine);
    })
    .on("click", () => {
      handleClick(idBusLine);
    });
}

export function busLinePolylineAttachEvent(
  polyline: L.Polyline,
  idBusLine: number,
  arrowsLinked: L.Marker[]
): void {
  attachEvent(polyline, polyline, arrowsLinked, idBusLine);
}

export function arrowAttachEvent(
  arrow: L.Marker,
  polyline: L.Polyline,
  idBusLine: number,
  arrowsLinked: L.Marker[]
): void {
  attachEvent(arrow, polyline, arrowsLinked, idBusLine);
}

// fetchOnRoadPolyline() is called in readMode only
export async function fetchOnRoadPolyline(latlng: L.LatLng[]) {
  // console.log("latlng", latlng);
  const lnglat = latlng.map((prev) => [prev.lng, prev.lat]);
  const urlLnglat = lnglat
    .map((couple) => couple[0] + "," + couple[1])
    .join(";");

  // console.log("urlLnglat", urlLnglat);

  const parameters = { geometries: "geojson", overview: "full" };
  const urlParameters = Object.entries(parameters)
    .map((couple) => couple[0] + "=" + couple[1])
    .join("&");

  const urlToFetch =
    import.meta.env.VITE_API_OSRM_URL + "/" + urlLnglat + "?" + urlParameters;

  // console.log("urlToFetch", urlToFetch);

  return await fetch(urlToFetch)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      // Coordinates returned by OSRM is in the format (longitude, latitude)
      const coordinates = res.routes[0].geometry.coordinates;
      return {
        latlngs: coordinates.map((elt: number[]) => L.latLng(elt[1], elt[0])),
      };
    });
}

export async function computePolyline(
  color: string,
  stops: PointIdentityType[]
) {
  const [, { isInReadMode }] = useStateAction();
  let polylineLatLngs = getLatLngs(stops);
  let opacity = 1;
  if (isInReadMode()) {
    const readModePolylineLatLngs = (await fetchOnRoadPolyline(polylineLatLngs))
      .latlngs;
    const readModeOpacity = 0.8;
    // Need to check if is still in readMode because of await
    if (isInReadMode()) {
      polylineLatLngs = readModePolylineLatLngs;
      opacity = readModeOpacity;
    }
  }
  const busLinePolyline = getBusLinePolyline(color, polylineLatLngs, opacity);
  return busLinePolyline;
}

function computeArrowsInReadMode(latLngs: L.LatLng[], color: string) {
  const increment = 10;
  const iStart = 2;

  const arrows: L.Marker[] = [];

  for (let i = iStart; i < latLngs.length - 1; i = i + increment) {
    // on road routes
    const latArrow = latLngs[i].lat;
    const lngArrow = latLngs[i].lng;
    const diffX = latLngs[i + 1].lng - latLngs[i - 1].lng;
    const diffY = latLngs[i + 1].lat - latLngs[i - 1].lat;

    const arrowAngle = (Math.atan2(diffX, diffY) * 180) / Math.PI + 180;
    const arrowIcon = L.divIcon({
      className: "",
      html: getArrowSVG(color, arrowAngle),
    });

    // arrow creation
    const arrow = new L.Marker([latArrow, lngArrow], {
      icon: arrowIcon,
      pane: "overlayPane",
      keyboard: false,
    });

    arrows.push(arrow);
  }

  return arrows;
}

function computeArrowsInNotReadMode(latLngs: L.LatLng[], color: string) {
  const increment = 1;
  const iStart = 0;

  const arrows: L.Marker[] = [];

  for (let i = iStart; i < latLngs.length - 1; i = i + increment) {
    // straight routes
    const latArrow = (latLngs[i + 1].lat - latLngs[i].lat) / 2 + latLngs[i].lat;
    const lngArrow = (latLngs[i + 1].lng - latLngs[i].lng) / 2 + latLngs[i].lng;
    const diffX = latLngs[i + 1].lng - latLngs[i].lng;
    const diffY = latLngs[i + 1].lat - latLngs[i].lat;

    const arrowAngle = (Math.atan2(diffX, diffY) * 180) / Math.PI + 180;
    const arrowIcon = L.divIcon({
      className: "",
      html: getArrowSVG(color, arrowAngle),
    });

    // arrow creation
    const arrow = new L.Marker([latArrow, lngArrow], {
      icon: arrowIcon,
      pane: "overlayPane",
    });

    arrows.push(arrow);
  }

  return arrows;
}

export function computeArrows(latLngs: L.LatLng[], color: string) {
  const [, { isInReadMode }] = useStateAction();

  if (isInReadMode()) {
    return computeArrowsInReadMode(latLngs, color);
  } else {
    return computeArrowsInNotReadMode(latLngs, color);
  }
}

function randColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

export function fetchBusLines() {
  authenticateWrap((headers) => {
    fetch(
      import.meta.env.VITE_BACK_URL + `/map/${getActiveMapId()}/bus_lines`,
      {
        headers,
      }
    ).then(async (res) => {
      const json: {
        message: string;
        content: {
          id_bus_line: number;
          color: string | null;
          stops: {
            id: number;
            id_point: number;
            nature: string;
          }[];
        }[];
      } = await res.json();

      const lines: LineType[] = json.content.map((resLine) => {
        const color = resLine.color ? "#" + resLine.color : randColor();
        const stopsWithNatureEnum = resLine.stops.map(
          (stop) =>
            ({
              id: stop.id,
              idPoint: stop.id_point,
              nature:
                stop["nature"] === "ramassage"
                  ? NatureEnum.ramassage
                  : NatureEnum.etablissement,
            } as PointIdentityType)
        );

        const [selected, setSelected] = createSignal(false);

        createEffect(() => {
          const selectedWk = selected();

          if (!linkBusLinePolyline[resLine.id_bus_line]) {
            return;
          }

          const { polyline, arrows } = linkBusLinePolyline[resLine.id_bus_line];

          const routeColor = getBusLineColor(busLines(), resLine.id_bus_line);
          if (!routeColor) {
            return;
          }

          if (selectedWk) {
            buslineSetBoldStyle(polyline, arrows, routeColor);
          } else {
            buslineSetNormalStyle(polyline, arrows, routeColor);
          }
        });

        const lineWk: LineType = {
          idBusLine: resLine.id_bus_line,
          color: color,
          stops: stopsWithNatureEnum,
          selected,
          setSelected,
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
        if (isInAddLineMode()) {
          setBusLines([]);
          return [];
        }

        // console.log("lines", lines);

        // TODO: check why this part of the code breaks the hot reload
        for (const line of lines) {
          // 1. Calcul de la polyline, à vol d'oiseau ou sur route
          // console.log("line.color", line.color);
          // console.log("line.stops", line.stops);
          computePolyline(line.color, line.stops).then((busLinePolyline) => {
            // console.log("busLinePolyline", busLinePolyline);

            const polylineLatLngs = busLinePolyline.getLatLngs() as L.LatLng[];
            // console.log("polylineLatLngs", polylineLatLngs);

            if (polylineLatLngs.length === 0) {
              return;
            }

            // 2. Calcul des fléches
            const arrows = computeArrows(polylineLatLngs, line.color);

            // 3.Attacher les events
            busLinePolylineAttachEvent(busLinePolyline, line.idBusLine, arrows);

            for (const arrow of arrows) {
              arrowAttachEvent(arrow, busLinePolyline, line.idBusLine, arrows);
            }

            // 4. Manage the display of buslines
            if (line.idBusLine in linkBusLinePolyline) {
              const { polyline: previousPolyline, arrows: previousArrows } =
                linkBusLinePolyline[line.idBusLine];
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
            };
          });
        }

        return lines;
      });
    });
  });
}

export const getSelectedBusLine = (): LineType | undefined => {
  const busLinesWk = busLines();
  if (busLinesWk.length == 0) {
    return;
  }
  return busLinesWk.find((busLine) => busLine.selected());
};

export const getSelectedBusLineId = (): number | undefined => {
  const selectedBusLine = getSelectedBusLine();

  if (!selectedBusLine) {
    return;
  }

  return selectedBusLine.idBusLine;
};
// Affichage du total de quantity
// export function getTimelineInfosOld(
//   busLine: LineUnderConstructionType
// ): TimelineItemType[] {
//   const stopIds = busLine.stops.map((stop) => stop.idPoint);
//   console.log("signal points", points());

//   return stopIds.map((stopId) => {
//     return {
//       name: points().filter((point) => point.idPoint === stopId)[0].name,
//       quantity: points().filter((point) => point.idPoint === stopId)[0]
//         .quantity,
//     };
//   });
// }
// TODO: Déplacer où ?
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [testData, setTestData] = createSignal<EleveVersEtablissementType[]>(
  await fetchEleveVersEtablissement(getActiveMapId() as number)
);

// TODO: Make it work with multiple schools
// TODO: Refactor (faire le + de fct pures possibles)
export function getTimelineInfos(
  busLine: LineUnderConstructionType
): TimelineItemType[] {
  const stopIds = busLine.stops.map((stop) => stop.idPoint);

  console.log("fetch data=>", testData());
  console.log("selectedBusLine=>", busLine);

  const etablissementId = busLine.stops.filter(
    (point) => point.nature == NatureEnum.etablissement
  )[0].idPoint;

  console.log("etablissementId selectioné", etablissementId);
  let totalQuantity = 0;
  return stopIds.map((stopId) => {
    let quantity = 0;

    testData()
      .filter(
        (data) =>
          data.etablissement_id_point == etablissementId &&
          data.ramassage_id_point == stopId
      )
      .map((eleve_vers_etablissement) => {
        quantity += eleve_vers_etablissement.quantity;
        totalQuantity += eleve_vers_etablissement.quantity;
      });
    // TODO: points() will be replaced by ramassage() and etalbissement()
    return {
      nature: points().filter((point) => point.idPoint === stopId)[0].nature,
      name: points().filter((point) => point.idPoint === stopId)[0].name,
      quantity:
        stopId == etablissementId
          ? (() => {
              const actualTotalQuantity = totalQuantity;
              totalQuantity = 0;
              return actualTotalQuantity;
            })()
          : quantity,
    };
  });
}

export function getTimelineInfosAddLineMode(
  // busLine: LineUnderConstructionType
  busLine: LineType
): TimelineItemType[] {
  console.log("getTimelineInfosAddLineMode executed");
  console.log("addlinemodebusline => ", busLine);
  if (busLine.stops.length == 0) {
    return [];
  }

  const stopIds = busLine.stops.map((stop) => stop.idPoint);

  console.log("fetch data=>", testData());
  console.log("selectedBusLine=>", busLine);

  const etablissementId = busLine.etablissementSelected?.idPoint;

  console.log("etablissementId selectioné", etablissementId);

  return stopIds.map((stopId) => {
    let quantity = 0;
    testData()
      .filter(
        (data) =>
          data.etablissement_id_point == etablissementId &&
          data.ramassage_id_point == stopId
      )
      .map((eleve_vers_etablissement) => {
        quantity += eleve_vers_etablissement.quantity;
        // TODO: Fix infinity loop issue caused here
        setTotalQuantity((prev) => prev + quantity);
      });
    console.log("testBoucle");
    return {
      nature: points().filter((point) => point.idPoint === stopId)[0].nature,
      name: points().filter((point) => point.idPoint === stopId)[0].name,
      // quantity: quantity,
      quantity:
        stopId == etablissementId
          ? (() => {
              // const actualTotalQuantity = totalQuantity;
              const actualTotalQuantity = totalQuantity();
              // totalQuantity = 0;
              setTotalQuantity(0);
              return actualTotalQuantity;
              // return quantity;
            })()
          : quantity,
    };
  });
}

export const selectedBusLineInfos = (): TimelineItemType[] => {
  const selectedBusLine = getSelectedBusLine();

  if (!selectedBusLine) {
    return [];
  }

  return getTimelineInfos(selectedBusLine);
};

// TODO: Fix type difference (LineType)
export const lineUnderConstructionInfos = () => {
  console.log("in busline utils => lineUnderConstructionInfos");

  return getTimelineInfosAddLineMode(getLineUnderConstruction() as LineType);
};

function getStopNames(busLine: LineUnderConstructionType) {
  const stopIds = busLine.stops.map((stop) => stop.idPoint);

  return stopIds.map(
    (stopId) => points().filter((point) => point.idPoint === stopId)[0].name
  );
}

// TODO: Delete
export const lineUnderConstructionStopNames = () => {
  return getStopNames(getLineUnderConstruction());
};
