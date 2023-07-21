import L, { LeafletMouseEvent } from "leaflet";
import { createEffect, on, onCleanup, onMount } from "solid-js";

import { useStateAction } from "../../../../../StateAction";
import { points } from "../../../../../signaux";

import "./Point.css";

export const linkMap = new Map<number, L.CircleMarker>();

const [, { isInAddLineMode }] = useStateAction();

export function deselectAllPoints() {
  points().map((point) => point.setSelected(false));
}

interface PointProps {
  map: L.Map;
  isLast: boolean;
  onIsLast: () => void;
  idPoint: number;
  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;

  borderColor: string;
  fillColor: string;
  weight: number;
  radius: number;

  lat: number;
  lon: number;

  isBlinking?: boolean;
}

export default function (props: PointProps) {
  // const isLast = () => props.isLast;
  let circle: L.CircleMarker;

  // TODO: Put in css only (.addlinemode .point)
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

    createEffect(() => {
      if (props.isBlinking) {
        circle
          .getElement()
          ?.classList.add("circle-animation-" + props.borderColor);
      } else {
        circle
          .getElement()
          ?.classList.remove("circle-animation-" + props.borderColor);
      }
    });

    createEffect(() => {
      circle.setRadius(props.radius);
      circle
        .getElement()
        ?.setAttribute("stroke-width", props.weight.toString());
    });

    // TODO: Test deletion
    // const element = circle.getElement();
    // if (element) {
    //   linkMap.set(props.idPoint, circle);
    // }

    // TODO: Appeler une fonction spécifique passer en props (onMount)
    // if (isLast()) {
    //   props.onIsLast();
    //   if (nature() === NatureEnum.ramassage) {
    //     setIsRamassageReady(true);
    //   } else {
    //     setIsEtablissementReady(true);
    //   }
    // }
  });

  onCleanup(() => {
    // try without linkMap
    linkMap.delete(props.idPoint);
    circle.remove();
  });

  return <></>;
}
