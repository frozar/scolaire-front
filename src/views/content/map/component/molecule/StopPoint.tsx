import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import { COLOR_STOP_FOCUS } from "../../constant";
import Point from "../atom/Point";

import { StopPointUtil } from "../../../../../utils/stopPoint.utils";
import { blinkingStops } from "../organism/Points";

const [, { isInReadMode }] = useStateAction();

export interface StopPointProps {
  point: StopType;
  map: L.Map;

  minQuantity: number;
  maxQuantity: number;
}
const minRadius = 5;
const maxRadius = 10;
const rangeRadius = maxRadius - minRadius;

export function StopPoint(props: StopPointProps) {
  const rad = (): number => {
    if (isInReadMode()) return 5;
    let radiusValue = minRadius;
    const quantity = props.point.associated.reduce(
      (acc, stop) => acc + stop.quantity,
      0
    );

    if (quantity && props.maxQuantity && props.minQuantity) {
      const coef =
        props.minQuantity == props.maxQuantity
          ? 0
          : (quantity - props.minQuantity) /
            (props.maxQuantity - props.minQuantity);

      radiusValue += coef * rangeRadius;
    }

    return radiusValue;
  };

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingStops().includes(props.point.id)}
      borderColor={COLOR_STOP_FOCUS}
      fillColor={COLOR_STOP_FOCUS}
      radius={rad()}
      weight={0}
      onClick={() => StopPointUtil.onClick(props.point)}
      onMouseOver={() => StopPointUtil.onMouseOver(props.point)}
      onMouseOut={() => StopPointUtil.onMouseOut(props.point)}
      onRightClick={() => StopPointUtil.onRightClick(props.point)}
      onMouseUp={() => StopPointUtil.onMouseUp(props.point, props.map)}
    />
  );
}
