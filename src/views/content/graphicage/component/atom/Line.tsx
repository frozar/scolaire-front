import { LineString } from "geojson";
import L, { LeafletMouseEvent } from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { getLeafletMap } from "../../../../../signaux";
import {
  currentStep,
  drawModeStep,
} from "../organism/AddLineInformationBoardContent";
import { arrowsMap } from "../organism/BusLines";

interface LineProps {
  latlngs: L.LatLng[];
  leafletMap: L.Map;
  color: string;
  opacity: number;

  lineId?: number;
  // withArrows?: boolean;
  onMouseOver?: (polyline: L.Polyline, arrows: L.Marker[]) => void;
  onMouseOut?: (polyline: L.Polyline, arrows: L.Marker[]) => void;
  onClick?: () => void;
}

export default function (props: LineProps) {
  let busLinePolyline: L.Polyline;

  createEffect(() => {
    let arrows: L.Marker[] = [];
    const latlngs = props.latlngs;
    const leafletMap = props.leafletMap;

    const color = props.color;
    const opacity = props.opacity;

    if (busLinePolyline) {
      props.leafletMap.removeLayer(busLinePolyline);
      busLinePolyline.remove();
    }

    busLinePolyline = buildLeafletPolyline(color, latlngs, opacity);
    if (currentStep() === drawModeStep.polylineEdition) {
      arrows = buildUpdatePoint(props.latlngs, "white");
    } else {
      arrows = buildArrows(props.latlngs, color);
    }
    console.log(arrows);

    // Add events to Line & Arrows
    if (props.onMouseOver || props.onMouseOut || props.onClick) {
      let leafletLineElems: (L.Polyline | L.Marker)[] = [busLinePolyline];

      leafletLineElems = [...leafletLineElems, ...arrows];

      if (props.onMouseOver != undefined) {
        leafletLineElems.map((elem) =>
          // eslint-disable-next-line solid/reactivity
          elem.on("mouseover", () =>
            props.onMouseOver?.(busLinePolyline, arrows)
          )
        );
      }

      if (props.onMouseOut != undefined) {
        leafletLineElems.map((elem) =>
          // eslint-disable-next-line solid/reactivity
          elem.on("mouseout", () => props.onMouseOut?.(busLinePolyline, arrows))
        );
      }
      if (props.onClick) {
        leafletLineElems.map((elem) =>
          // eslint-disable-next-line solid/reactivity
          elem.on("click", () => props.onClick?.())
        );
      }
    }

    // Add Line & Arrows to the map
    busLinePolyline.addTo(leafletMap);
    for (const arrow of arrows) {
      arrow.addTo(leafletMap);
      // Map use to desable the arrows on drawMode
      arrowsMap.set(props.lineId ?? -1, arrows);
    }
  });

  onCleanup(() => {
    console.log("je clean");

    if (busLinePolyline) {
      props.leafletMap.removeLayer(busLinePolyline);
      busLinePolyline.remove();
    }
  });

  return <></>;
}

function buildLeafletPolyline(
  color: string,
  latlngs: L.LatLng[],
  opacity = 1
): L.Polyline<LineString> {
  return L.polyline(latlngs, {
    color: color,
    opacity: opacity,
  }) as L.Polyline<LineString>;
}

/**
 *
 *  Arrow's functions
 *
 */

function buildArrows(latLngs: L.LatLng[], color: string): L.Marker[] {
  const increment = 30;
  const iStart = 2;
  const iLast = 2;

  const arrows: L.Marker[] = [];

  for (let i = iStart; i < latLngs.length - iLast; i = i + increment) {
    // on road routes
    const latArrow = latLngs[i].lat;
    const lngArrow = latLngs[i].lng;
    const diffX = latLngs[i + 1].lng - latLngs[i - 1].lng;
    const diffY = latLngs[i + 1].lat - latLngs[i - 1].lat;

    const arrowAngle = (Math.atan2(diffX, diffY) * 180) / Math.PI + 180;

    const arrowIcon = L.divIcon({
      className: "bus-line-arrow",
      html: getArrowSVG(color, arrowAngle),
    });

    const arrow = new L.Marker([latArrow, lngArrow], {
      icon: arrowIcon,
      pane: "overlayPane",
      keyboard: false,
    });

    arrows.push(arrow);
  }
  return arrows;
}

function buildUpdatePoint(latLngs: L.LatLng[], color: string): L.Marker[] {
  const increment = 30;
  const iStart = 2;
  const iLast = 2;

  const arrows: L.Marker[] = [];

  for (let i = iStart; i < latLngs.length - iLast; i = i + increment) {
    // on road routes
    const latArrow = latLngs[i].lat;
    const lngArrow = latLngs[i].lng;

    const arrowIcon = L.divIcon({
      className: "bus-line-drag",
      html: getUpdateSVG(color),
    });

    const arrow = new L.Marker([latArrow, lngArrow], {
      icon: arrowIcon,
      pane: "overlayPane",
      keyboard: false,
    });
    // getLeafletMap()?.on("mousemove", function (e: LeafletMouseEvent) {
    //   console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
    // });
    //TODO resolve MapLeaflet responsivity
    arrow.addEventListener("click", () => {
      console.log("test ", i);
      getLeafletMap()?.on("mousemove", function (e: LeafletMouseEvent) {
        console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);
        arrow.setLatLng(L.latLng(e.latlng.lat, e.latlng.lng));

        latLngs[i].lat = e.latlng.lat;
        latLngs[i].lng = e.latlng.lng;
      });
      // getLeafletMap().on("mouseover", function (e: LeafletMouseEvent) {
      //   +      console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng);}
      // arrow.setLatLng(L.latLng())
      // latLngs[i].lat = 10;
    });
    arrows.push(arrow);
  }
  return arrows;
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

export function getUpdateSVG(color: string) {
  return (
    "<svg fill=" +
    color +
    " stroke-width='0' xmlns='http://www.w3.org/2000/svg' height='3pt' width='3pt' " +
    "style='overflow: visible;'> <circle cx='5' cy='5' r='5' /></svg>"
  );
}
