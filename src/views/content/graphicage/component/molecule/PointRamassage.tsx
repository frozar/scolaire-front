import { LeafletMouseEvent } from "leaflet";
import { createEffect, createSignal } from "solid-js";
import Point from "../atom/Point";

export interface PointRamassageProps {
  idPoint: number;
  lat: number;
  lon: number;
  map: L.Map;
  isLast: boolean;
  isBlinking?: boolean;

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
    const coef =
      props.minQuantity == props.maxQuantity
        ? 0
        : (props.quantity - props.minQuantity) /
          (props.maxQuantity - props.minQuantity);

    const radiusValue = coef * rangeRadius + minRadius;
    setRadius(radiusValue);
  });

  return (
    <Point
      {...props}
      borderColor="red"
      fillColor="white"
      radius={radius()}
      weight={4}
    />
  );
}
