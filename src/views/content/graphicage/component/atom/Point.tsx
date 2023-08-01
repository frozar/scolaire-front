import L, { LeafletMouseEvent } from "leaflet";
import { Accessor, Setter, createEffect, onCleanup, onMount } from "solid-js";

// import { linkMap } from "../../Point";
import { linkMap } from "../organism/Points";
import "./Point.css";

export type PointIdentityType = {
  id: number;
  idPoint: number;
};

export interface PointInformation extends PointIdentityType {
  lon: number;
  lat: number;
  name: string;
  quantity?: number;
}
export interface PointInterface extends PointInformation {
  selected: Accessor<boolean>;
  setSelected: Setter<boolean>;
  associatedPoints: Accessor<PointIdentityType[]>;
  setAssociatedPoints: Setter<PointIdentityType[]>;
}

export interface PointProps {
  point: PointInterface;

  map: L.Map;
  isBlinking?: boolean;

  borderColor: string;
  fillColor: string;
  weight: number;
  radius: number;

  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export default function (props: PointProps) {
  let circle: L.CircleMarker;

  onMount(() => {
    if (!props.point) {
      return;
    }

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
  });

  createEffect(() => {
    const element = linkMap
      .get(props.point.idPoint)
      ?.getElement() as HTMLElement;

    if (element) {
      element.style.setProperty("--stroke-color", props.borderColor);
      if (props.isBlinking) {
        element.classList.add("circle-animation");
      } else {
        element.classList.remove("circle-animation");
      }
    }
  });

  createEffect(() => {
    if (circle) {
      circle.setRadius(props.radius);
      circle
        .getElement()
        ?.setAttribute("stroke-width", props.weight.toString());
    }
  });

  onCleanup(() => {
    if (props.point) {
      linkMap.delete(props.point.idPoint);
    }
    if (circle) circle.remove();
  });

  return <></>;
}
