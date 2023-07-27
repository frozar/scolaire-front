// TODO: Fix radius reactivity
/* eslint-disable solid/reactivity */
import { LeafletMouseEvent } from "leaflet";
import { createEffect } from "solid-js";
import Point, { PointInterface } from "../atom/Point";
import { blinkingStopPoint } from "../organism/PointsEtalissement";

export interface PointRamassageProps {
  point: PointInterface;
  map: L.Map;
  isLast: boolean;

  isBlinking?: boolean;
  isLast: boolean;
  map: L.Map;

  minQuantity: number;
  maxQuantity: number;

  onIsLast: () => void;
  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

const minRadius = 5;
const maxRadius = 10;
const rangeRadius = maxRadius - minRadius;

// const [radius, setRadius] = createSignal(5);

export default function (props: PointRamassageProps) {
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
  // console.log("debut PointRamassage.tsx");

  createEffect(() => {
    if (props.quantity && props.maxQuantity && props.minQuantity) {
      const coef =
        props.minQuantity == props.maxQuantity
          ? 0
          : (props.quantity - props.minQuantity) /
            (props.maxQuantity - props.minQuantity);

      const radiusValue = coef * rangeRadius + minRadius;
      setRadius(radiusValue);
    }
  });

  // createEffect(() => {
  //   props.setRadius(radiusValue);
  // });

  // setRadius(radiusValue);
  // });
  // console.log("radiusValue", radius());
  return (
    <Point
      {...props}
      isBlinking={blinkingStopPoint().includes(props.point.idPoint)}
      borderColor="red"
      fillColor="white"
      // radius={props.point.radius()}
      radius={radiusValue}
      weight={4}
    />
  );
}
