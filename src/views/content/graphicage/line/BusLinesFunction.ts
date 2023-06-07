// import L from "leaflet";

// import { PointIdentityType } from "../../../../type";
// import { linkMap } from "../../../../global/linkPointIdentityCircle";
import L from "leaflet";

import { InfoPanelEnum, LineType, PointIdentityType } from "../../../../type";
import { linkMap } from "../../../../global/linkPointIdentityCircle";

import { useStateAction } from "../../../../StateAction";
import {
  busLines,
  linkBusLinePolyline,
  setBusLineSelected,
  setInfoToDisplay,
  setPickerColor,
  setRemoveConfirmation,
} from "../../../../signaux";
import { LineString } from "geojson";

export function getLatLngs(stops: PointIdentityType[]): L.LatLng[] {
  const latlngs: L.LatLng[] = [];

  for (const pointIdentity of stops) {
    const circle = linkMap.get(pointIdentity.id_point);
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

function arrowRemoveModeStyle(
  arrows: L.Marker[],
  color: string,
  transform: string
) {
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
  const busLine = busLines.find((route) => route.idBusLine == idBusLine);

  if (!busLine) {
    return;
  }

  return busLine.color;
}

export function busLinePolylineAttachEvent(
  self: L.Polyline,
  idBusLine: number,
  arrowsLinked: L.Marker[]
): void {
  const [, { isInReadMode, isInRemoveLineMode }] = useStateAction();
  self
    .on("mouseover", () => {
      if (isInRemoveLineMode()) {
        self.setStyle({ color: "#FFF", weight: 8 });
        arrowRemoveModeStyle(arrowsLinked, "white", "scale(4,4) ");
      }
    })
    .on("mouseout", () => {
      if (isInRemoveLineMode()) {
        const routeColor = getBusLineColor(busLines(), idBusLine);
        if (!routeColor) {
          return;
        }
        self.setStyle({ color: routeColor, weight: 3 });
        arrowRemoveModeStyle(arrowsLinked, routeColor, "scale(2,2) ");
      }
    })
    .on("click", () => {
      setPickerColor(linkBusLinePolyline[idBusLine].color);

      if (isInRemoveLineMode()) {
        setRemoveConfirmation({
          displayed: true,
          idBusLine: idBusLine,
        });
      }

      if (isInReadMode()) {
        setBusLineSelected(idBusLine);
        setInfoToDisplay(InfoPanelEnum.line);
      }
    });
}

export function arrowAttachEvent(
  arrow: L.Marker,
  polyline: L.Polyline,
  idBusLine: number,
  arrowsLinked: L.Marker[]
): void {
  const [, { isInReadMode, isInRemoveLineMode }] = useStateAction();
  arrow
    .on("mouseover", () => {
      if (isInRemoveLineMode()) {
        polyline.setStyle({ color: "#FFF", weight: 8 });
        arrowRemoveModeStyle(arrowsLinked, "white", "scale(4,4) ");
      }
    })
    .on("mouseout", () => {
      if (isInRemoveLineMode()) {
        const routeColor = getBusLineColor(busLines(), idBusLine);
        if (!routeColor) {
          return;
        }
        polyline.setStyle({ color: routeColor, weight: 3 });
        arrowRemoveModeStyle(arrowsLinked, routeColor, "scale(2,2) ");
      }
    })
    .on("click", () => {
      setPickerColor(linkBusLinePolyline[idBusLine].color);

      if (isInRemoveLineMode()) {
        setRemoveConfirmation({
          displayed: true,
          idBusLine: idBusLine,
        });
      }

      if (isInReadMode()) {
        setBusLineSelected(idBusLine);
        setInfoToDisplay(InfoPanelEnum.line);
      }
    });
}

// fetchOnRoadPolyline() is called in readMode only
export async function fetchOnRoadPolyline(latlng: L.LatLng[]) {
  const lnglat = latlng.map((prev) => [prev.lng, prev.lat]);
  const urlLnglat = lnglat
    .map((couple) => couple[0] + "," + couple[1])
    .join(";");

  const parameters = { geometries: "geojson", overview: "full" };
  const urlParameters = Object.entries(parameters)
    .map((couple) => couple[0] + "=" + couple[1])
    .join("&");

  const urlToFetch =
    import.meta.env.VITE_API_OSRM_URL + "/" + urlLnglat + "?" + urlParameters;
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
    polylineLatLngs = (await fetchOnRoadPolyline(polylineLatLngs)).latlngs;
    opacity = 0.8;
  }

  const busLinePolyline = getBusLinePolyline(color, polylineLatLngs, opacity);

  // return [polylineLatLngs, busLinePolylineData];
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
    });

    arrows.push(arrow);
  }

  return arrows;
}

function computeArrowsInOtherMode(latLngs: L.LatLng[], color: string) {
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
    return computeArrowsInOtherMode(latLngs, color);
  }
}
