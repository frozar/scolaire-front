import L, { LeafletMouseEvent } from "leaflet";
import { createEffect, on, onCleanup, onMount } from "solid-js";
import {
  NatureEnum,
  PointEtablissementType,
  PointRamassageType,
} from "../../../type";

import { useStateAction } from "../../../StateAction";
import {
  getLeafletMap,
  points,
  setIsEtablissementReady,
  setIsRamassageReady,
} from "../../../signaux";

export const linkMap = new Map<number, L.CircleMarker>();

const [, { isInAddLineMode }] = useStateAction();

export function deselectAllPoints() {
  points().map((point) => point.setSelected(false));
}

interface PointProps {
  point: PointRamassageType | PointEtablissementType;
  isLast: boolean;

  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;

  borderColor: string;
  fillColor: string;
  weight: number;
  radius: number;

  isBlinking?: boolean;
}

export default function (props: PointProps) {
  const point = () => props.point;
  const isLast = () => props.isLast;
  const nature = () => props.point.nature;

  let circle: L.CircleMarker;

  function buildCircle(point: PointEtablissementType): L.CircleMarker {
    const lon = point.lon;
    const lat = point.lat;

    return L.circleMarker([lat, lon], {
      color: props.borderColor,
      fillColor: props.fillColor,
      radius: props.radius,
      fillOpacity: 1,
      weight: props.weight,
      pane: "markerPane",
    })
      .on("click", props.onClick)
      .on("dblclick", props.onDBLClick)
      .on("mouseover", props.onMouseOver)
      .on("mouseout", props.onMouseOut);
  }

  // If a line is under construction, show a pencil when the mouse is over a circle
  createEffect(
    on(isInAddLineMode, (isInAddLineMode) => {
      if (circle) {
        const element = circle.getElement() as SVGElement;
        if (element) {
          if (isInAddLineMode) {
            if (String(element.style) !== "cursor: url('/pencil.png'), auto;") {
              // @ts-expect-error: 'style' field should not be assigned
              element.style = "cursor: url('/pencil.png'), auto;";
            }
          } else {
            if (String(element.style) !== "") {
              // @ts-expect-error: 'style' field should not be assigned
              element.style = "";
            }
          }
        }
      }
    })
  );

  onMount(() => {
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }

    circle = buildCircle(point());
    circle.addTo(leafletMap);

    const element = circle.getElement();
    if (element) {
      linkMap.set(point().idPoint, circle);
    }

    // Fetch associated points (ramassage or etablissement) and
    // store them in the associatedPoints() signal (used is the on'click' event)
    if (isLast()) {
      if (nature() === NatureEnum.ramassage) {
        setIsRamassageReady(true);
      } else {
        setIsEtablissementReady(true);
      }
    }
  });

  onCleanup(() => {
    linkMap.delete(point().idPoint);
    circle.remove();
  });

  return <></>;
}
