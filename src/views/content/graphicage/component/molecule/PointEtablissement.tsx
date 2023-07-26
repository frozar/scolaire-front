import { LeafletMouseEvent } from "leaflet";
import { createEffect } from "solid-js";
import { PointEtablissementType } from "../../../../../type";
import { linkMap } from "../../Point";
import Point from "../atom/Point";
import { blinkingStopPoint } from "../organism/PointsEtalissement";

export interface PointEtablissementProps {
  point: PointEtablissementType;
  map: L.Map;
  isLast: boolean;
  isBlinking?: boolean;

  onIsLast: () => void;
  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

export default function (props: PointEtablissementProps) {
  createEffect(() => {
    blinkingStopPoint();

    const element = linkMap.get(props.point.idPoint)?.getElement();
    if (!element) return;

    if (blinkingStopPoint().includes(props.point.idPoint)) {
      element.classList.add("circle-animation");
    } else {
      element.classList.remove("circle-animation");
    }
  });
  return (
    <Point
      {...props}
      borderColor="green"
      fillColor="white"
      radius={12}
      weight={4}
    />
  );
}
