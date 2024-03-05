import { LineString } from "geojson";
import L, { LeafletMouseEvent } from "leaflet";
import { createEffect, onCleanup } from "solid-js";
import { COLOR_GREEN_BASE } from "../../constant";
import { arrowsMap } from "../organism/Trips";

interface LineProps {
  latlngs: L.LatLng[];
  leafletMap: L.Map;
  color: string;
  opacity: number;

  lineId?: number;
  withArrows?: boolean;
  onMouseOver?: (polyline: L.Polyline, arrows: L.Marker[]) => void;
  onMouseOut?: (polyline: L.Polyline, arrows: L.Marker[]) => void;
  onClick?: () => void;
  onMouseDown?: (e: LeafletMouseEvent) => void;
}

export default function (props: LineProps) {
  let tripPolyline: L.Polyline;
  let arrows: L.Marker[] = [];

  createEffect(() => {
    const latlngs = props.latlngs;
    const leafletMap = props.leafletMap;

    const color = props.color;
    const opacity = props.opacity;

    if (tripPolyline) {
      props.leafletMap.removeLayer(tripPolyline);
      tripPolyline.remove();
    }

    tripPolyline = buildLeafletPolyline(color, latlngs, opacity, props.lineId);
    if (props.withArrows == true || props.withArrows == undefined) {
      if (arrows) {
        arrows.map((arrow) => leafletMap.removeLayer(arrow));
      }

      arrows = buildArrows(props.latlngs, color);
    }

    // Add events to Line & Arrows
    if (props.onMouseOver || props.onMouseOut || props.onClick) {
      let leafletLineElems: (L.Polyline | L.Marker)[] = [tripPolyline];
      if (props.lineId) {
        leafletLineElems = [...leafletLineElems, ...arrows];
      }

      if (props.onMouseOver != undefined) {
        leafletLineElems.map((elem) =>
          // eslint-disable-next-line solid/reactivity
          elem.on("mouseover", () => props.onMouseOver?.(tripPolyline, arrows))
        );
      }

      if (props.onMouseOut != undefined) {
        leafletLineElems.map((elem) =>
          // eslint-disable-next-line solid/reactivity
          elem.on("mouseout", () => props.onMouseOut?.(tripPolyline, arrows))
        );
      }
      if (props.onClick) {
        leafletLineElems.map((elem) =>
          // eslint-disable-next-line solid/reactivity
          elem.on("click", () => props.onClick?.())
        );
      }
      if (props.onMouseDown) {
        leafletLineElems.map((elem) =>
          // eslint-disable-next-line solid/reactivity
          elem.on("mousedown", (e) => props.onMouseDown?.(e))
        );
      }
    }
    // Add Line & Arrows to the map
    tripPolyline.addTo(leafletMap);
    if (props.lineId) {
      for (const arrow of arrows) {
        arrow.addTo(leafletMap);
      }
      // Map use to desable the arrows on drawMode
      arrowsMap.set(props.lineId, arrows);
    }
  });

  onCleanup(() => {
    if (tripPolyline) {
      props.leafletMap.removeLayer(tripPolyline);
      tripPolyline.remove();
    }
    if (arrows) {
      arrows.map((arrow) => props.leafletMap.removeLayer(arrow));
    }
  });

  return <></>;
}

function buildLeafletPolyline(
  color = COLOR_GREEN_BASE,
  latlngs: L.LatLng[],
  opacity = 1,
  lineId?: number
): L.Polyline<LineString> {
  const res = L.polyline(latlngs, {
    color: color,
    opacity: opacity,
  }) as L.Polyline<LineString>;

  res["lineId"] = lineId;
  return res;
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
      className: "bus-trip-arrow",
      html: getArrowSVG(color, arrowAngle),
    });

    arrows.push(
      new L.Marker([latArrow, lngArrow], {
        icon: arrowIcon,
        pane: "overlayPane",
        keyboard: false,
      })
    );
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
