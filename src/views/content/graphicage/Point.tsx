import L from "leaflet";
import { createEffect, on, onCleanup, onMount } from "solid-js";
import {
  NatureEnum,
  PointEtablissementType,
  PointRamassageType,
} from "../../../type";

import { useStateAction } from "../../../StateAction";
import {
  getLeafletMap,
  setIsEtablissementReady,
  setIsRamassageReady,
} from "../../../signaux";
import { buildCircleEvent, linkMap } from "./pointUtils";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

// function selectPointById(targerIdPoint: number) {
//   points().map((point) => point.setSelected(targerIdPoint == point.idPoint));
// }

// export function deselectAllPoints() {
//   points().map((point) => point.setSelected(false));
// }

const minSizeValue = 5;
const maxSizeValue = 10;
const range = maxSizeValue - minSizeValue;

interface PointProps {
  point: PointRamassageType | PointEtablissementType;
  isLast: boolean;
  nature: NatureEnum;
  minQuantity: number;
  maxQuantity: number;
}

export default function (props: PointProps) {
  const point = () => props.point;
  const isLast = () => props.isLast;
  const nature = () => props.nature;
  const minQuantity = () => props.minQuantity;
  const maxQuantity = () => props.maxQuantity;

  let circle: L.CircleMarker;

  function buildCircle(point: PointEtablissementType): L.CircleMarker {
    const lon = point.lon;
    const lat = point.lat;

    const coef =
      minQuantity() == maxQuantity()
        ? 0
        : (point.quantity - minQuantity()) / (maxQuantity() - minQuantity());

    const radiusValue = coef * range + minSizeValue;

    const { nature } = point;

    const [color, fillColor, radius, weight] =
      nature === NatureEnum.ramassage
        ? ["red", "white", radiusValue, 2]
        : nature === NatureEnum.etablissement
        ? ["green", "white", 12, 4]
        : ["white", "#000", 18, 4];

    return L.circleMarker([lat, lon], {
      color,
      fillColor,
      radius,
      fillOpacity: 1,
      weight,
      pane: "markerPane",
    })
      .on("click", () => buildCircleEvent.onClick(point))
      .on("dblclick", buildCircleEvent.onDBLClick)
      .on("mouseover", () => {
        for (const associatedPoint of point.associatedPoints()) {
          const element = linkMap.get(associatedPoint.idPoint)?.getElement();
          const { nature } = associatedPoint;
          const className =
            nature === NatureEnum.ramassage
              ? "circle-animation-ramassage"
              : "circle-animation-etablissement";
          if (element) {
            element.classList.add(className);
          }
        }
      })
      .on("mouseout", () => {
        for (const associatedPoint of point.associatedPoints()) {
          const element = linkMap.get(associatedPoint.idPoint)?.getElement();
          const { nature } = associatedPoint;
          const className =
            nature === NatureEnum.ramassage
              ? "circle-animation-ramassage"
              : "circle-animation-etablissement";

          if (element) {
            element.classList.remove(className);
          }
        }
      });
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
