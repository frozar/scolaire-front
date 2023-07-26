import L, { LeafletMouseEvent } from "leaflet";
import { createEffect, onCleanup, onMount } from "solid-js";

import { points } from "../../../../../signaux";

import { linkMap } from "../../Point";
import "./Point.css";

export function deselectAllPoints() {
  points().map((point) => point.setSelected(false));
}

export interface PointProps {
  idPoint: number;
  lat: number;
  lon: number;
  map: L.Map;
  isLast: boolean;
  isBlinking?: boolean;

  borderColor: string;
  fillColor: string;
  weight: number;
  radius: number;

  onIsLast: () => void;
  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export default function (props: PointProps) {
  let circle: L.CircleMarker;

  onMount(() => {
    circle = L.circleMarker([props.lat, props.lon], {
      color: props.borderColor,
      fillColor: props.fillColor,
      radius: props.radius,
      fillOpacity: 1,
      weight: props.weight,
      pane: "markerPane",
      className: "map-point",
    })
      .on("click", props.onClick)
      .on("dblclick", props.onDBLClick)
      .on("mouseover", props.onMouseOver)
      .on("mouseout", props.onMouseOut)
      .addTo(props.map);

    const element = circle.getElement();
    if (element) {
      linkMap.set(props.idPoint, circle);
    }

    createEffect(() => {
      const circleElement = circle.getElement() as HTMLElement;
      circleElement.style.setProperty("--stroke-color", props.borderColor);

      if (props.isBlinking) {
        circleElement.classList.add("circle-animation");
      } else {
        circleElement.classList.remove("circle-animation");
      }
    });

    createEffect(() => {
      circle.setRadius(props.radius);
      circle
        .getElement()
        ?.setAttribute("stroke-width", props.weight.toString());
    });

    createEffect(() => {
      if (props.isLast) {
        props.onIsLast();
      }
    });
  });

  onCleanup(() => {
    circle.remove();
  });

  return <></>;
}
