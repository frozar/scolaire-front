import L from "leaflet";
import { createSignal } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import { StopType } from "../../../../_entities/stop.entity";
import { StopPointUtil } from "../../../../utils/stopPoint.utils";
import { ViewManager } from "../../ViewManager";
import Point from "../../map/component/atom/Point";
import { blinkingStops } from "../../map/component/organism/Points";
import { COLOR_BLUE_BASE, COLOR_STOP_FOCUS } from "../../map/constant";

const [, { isInReadMode }] = useStateAction();

export const [stopPointOnClick, setStopPointOnClick] = createSignal<
  ((stop: StopType) => void) | undefined
>();

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
  function tooltip() {
    if (!props.point.name) return undefined;
    const tooltip = L.tooltip({
      className: "point-tooltip",
      opacity: 1,
      direction: "top",
    });
    const pos = L.latLng(props.point.lat, props.point.lon);
    tooltip.setLatLng(pos);
    tooltip.setContent(props.point.name);
    return tooltip;
  }

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

  function onClick(stop: StopType) {
    if (stopPointOnClick()) {
      (stopPointOnClick() as (stop: StopType) => void)(stop);
    } else {
      ViewManager.stopDetails(stop);
    }
  }

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingStops().includes(props.point.id)}
      borderColor={COLOR_BLUE_BASE}
      fillColor={COLOR_STOP_FOCUS}
      radius={rad()}
      weight={2}
      onClick={() => onClick(props.point)}
      tootlip={tooltip()}
      //TODO supprimer les dépenses à StopPointUtil
      onMouseOver={() => StopPointUtil.onMouseOver(props.point)}
      onMouseOut={() => StopPointUtil.onMouseOut(props.point)}
      onRightClick={() => StopPointUtil.onRightClick(props.point)}
      onMouseUp={() => StopPointUtil.onMouseUp(props.point, props.map)}
    />
  );
}
