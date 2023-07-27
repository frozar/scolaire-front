import L, { LeafletMouseEvent } from "leaflet";
import { Accessor, Setter, createEffect, onCleanup, onMount } from "solid-js";

import { points } from "../../../../../signaux";

import { linkMap } from "../../Point";
import "./Point.css";

export function deselectAllPoints() {
  points().map((point) => point.setSelected(false));
}

export type PointIdentityType = {
  id: number;
  idPoint: number;
};

export interface PointInterface extends PointIdentityType {
  lon: number;
  lat: number;
  name: string;
  quantity: number;
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  associatedPoints: Accessor<PointIdentityType[]>;
  setAssociatedPoints: Setter<PointIdentityType[]>;
}

export interface PointProps {
  point: PointInterface;

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

  createEffect(() => {
    const element = linkMap.get(props.point.idPoint)?.getElement();
    if (element && props.isBlinking) {
      element.classList.add("circle-animation");
    } else if (element && !props.isBlinking) {
      element.classList.remove("circle-animation");
    } else return;
  });

  onMount(() => {
    circle = L.circleMarker([props.point.lat, props.point.lon], {
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
      linkMap.set(props.point.idPoint, circle);
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
    linkMap.delete(props.point.idPoint);
    circle.remove();
  });

  return <></>;
}
