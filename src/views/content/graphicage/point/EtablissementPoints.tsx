import L, { LeafletMouseEvent } from "leaflet";
import { For } from "solid-js";
import { useStateAction } from "../../../../StateAction";
import {
  NatureEnum,
  PointIdentityType,
  PointRamassageType,
} from "../../../../type";
import { renderAnimation } from "../animation";
import { deselectAllBusLines } from "../line/busLinesUtils";
import { linkMap, selectPointById } from "../pointUtils";
import Point from "./atom/Point";

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

interface ShoolPointProps {
  items: PointRamassageType[];
}
export default function (props: ShoolPointProps) {
  const filteredPoints = () =>
    props.items
      .filter((value) => Number.isFinite(value.quantity))
      .map((value) => value.quantity);

  const minQuantity = () => {
    const minCandidat = Math.min(...filteredPoints());
    return Number.isFinite(minCandidat) ? minCandidat : 0;
  };

  const maxQuantity = () => {
    const maxCandidat = Math.max(...filteredPoints());
    return Number.isFinite(maxCandidat) ? maxCandidat : 0;
  };

  return (
    <For each={props.items}>
      {(point, i) => {
        const onClick = () => {
          // Select the current element to display information
          if (!isInAddLineMode()) {
            deselectAllBusLines();
            selectPointById(point.idPoint);
            return;
          }

          const pointIdentity: PointIdentityType = {
            id: point.id,
            idPoint: point.idPoint,
            nature: point.nature,
          };

          addPointToLineUnderConstruction(pointIdentity);

          if (!(1 < getLineUnderConstruction().stops.length)) {
            return;
          }

          // Highlight point ramassage
          for (const associatedPoint of point.associatedPoints()) {
            let element;
            if (
              (element = linkMap.get(associatedPoint.idPoint)?.getElement())
            ) {
              renderAnimation(element);
            }
          }
        };

        const onDBLClick = (event: LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(event);
        };

        const onMouseOver = () => {
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
        };

        const onMouseOut = () => {
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
        };

        // TODO: these line is for ramassage
        // const minSizeValue = 5;
        // const maxSizeValue = 10;
        // const range = maxSizeValue - minSizeValue;
        // const coef =
        minQuantity() == maxQuantity()
          ? 0
          : (point.quantity - minQuantity()) / (maxQuantity() - minQuantity());

        // const radiusValue = coef * range + minSizeValue;
        // ----- end line

        return (
          <Point
            radius={12}
            point={point}
            isLast={i() === props.items.length - 1}
            onClick={onClick}
            borderColor="green"
            fillColor="white"
            onDBLClick={onDBLClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            weight={4}
          />
        );
      }}
    </For>
  );
}
