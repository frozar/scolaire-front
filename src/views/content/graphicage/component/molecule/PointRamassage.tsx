import { LeafletMouseEvent } from "leaflet";
import Point, { PointInterface } from "../atom/Point";
import { blinkingPoints } from "../organism/Points";

export interface PointRamassageProps {
  point: PointInterface;
  map: L.Map;

  minQuantity: number;
  maxQuantity: number;

  onClick: () => void;
  onDBLClick: (event: LeafletMouseEvent) => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}
const minRadius = 5;
const maxRadius = 10;
const rangeRadius = maxRadius - minRadius;

export default function (props: PointRamassageProps) {
  const rad = () => {
    let radiusValue: number;
    if (props.point.quantity && props.maxQuantity && props.minQuantity) {
      const coef =
        props.minQuantity == props.maxQuantity
          ? 0
          : (props.point.quantity - props.minQuantity) /
            (props.maxQuantity - props.minQuantity);

      radiusValue = coef * rangeRadius + minRadius;
      return radiusValue;
    }
  };

  return (
    <Point
      {...props}
      isBlinking={blinkingPoints().includes(props.point.idPoint)}
      borderColor="red"
      fillColor="white"
      radius={rad() as number}
      weight={2}
    />
  );
}
