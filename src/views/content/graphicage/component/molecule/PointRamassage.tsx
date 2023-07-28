import { LeafletMouseEvent } from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { blinkingStopPoint } from "../../PointsRamassageAndEtablissement";
import Point, { PointInterface } from "../atom/Point";

export interface PointRamassageProps {
  point: PointInterface;
  map: L.Map;
  isLast: boolean;

  quantity: number;
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
const [radius, setRadius] = createSignal(5);

export default function (props: PointRamassageProps) {
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

  return (
    <Point
      {...props}
      isBlinking={blinkingStopPoint().includes(props.point.idPoint)}
      borderColor="red"
      fillColor="white"
      radius={radius()}
      weight={4}
    />
  );
}
