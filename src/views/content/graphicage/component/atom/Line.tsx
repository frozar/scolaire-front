import { LineString } from "geojson";
import L from "leaflet";
import { createEffect, createSignal, onCleanup } from "solid-js";

interface LineProps {
  latlngs: L.LatLng[];
  leafletMap: L.Map;
  color: string;
  opacity: number;

  withArrows?: boolean;
  onMouseOver?: (polyline: L.Polyline, arrows: L.Marker[]) => void;
  onMouseOut?: (polyline: L.Polyline, arrows: L.Marker[]) => void;
  onClick?: () => void;
}

const [localArrows, setLocalArrows] = createSignal<L.Marker[]>([]);

export default function (props: LineProps) {
  let busLinePolyline: L.Polyline;

  createEffect(() => {
    const latlngs = props.latlngs;
    const leafletMap = props.leafletMap;

    const color = props.color;
    const opacity = props.opacity;

    busLinePolyline?.remove();

    busLinePolyline = buildLeafletPolyline(color, latlngs, opacity);

    if (props.withArrows) {
      setLocalArrows(buildArrows(props.latlngs, color));
    }

    // Add events to Line & Arrows
    if (props.onMouseOver || props.onMouseOut || props.onClick) {
      let leafletElem: (L.Polyline | L.Marker)[] = [busLinePolyline];
      if (props.withArrows) {
        leafletElem = [...leafletElem, ...localArrows()];
      }

      if (props.onMouseOver != undefined) {
        leafletElem.map((elem) =>
          elem.on("mouseover", () =>
            props.onMouseOver?.(busLinePolyline, localArrows())
          )
        );
      }

      if (props.onMouseOut != undefined) {
        leafletElem.map((elem) =>
          elem.on("mouseout", () =>
            props.onMouseOut?.(busLinePolyline, localArrows())
          )
        );
      }
      if (props.onClick) {
        leafletElem.map((elem) => elem.on("click", () => props.onClick?.()));
      }
    }

    // Add Line & Arrows to the map
    busLinePolyline.addTo(leafletMap);
    if (props.withArrows) {
      for (const arrow of localArrows()) {
        arrow.addTo(leafletMap);
      }
    }
    //TODO ajouter les event Arrows et Polyline
  });

  onCleanup(() => {
    busLinePolyline?.remove();
  });

  return <></>;
}

function buildLeafletPolyline(
  color: string,
  latlngs: L.LatLng[],
  opacity: number = 1
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
