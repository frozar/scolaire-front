import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import { COLOR_STOP_FOCUS, COLOR_STOP_LIGHT } from "../../constant";
import Point from "../atom/Point";
import { deselectAllBusLines } from "../organism/BusLines";

import {
  BusLineType,
  updatePolylineWithOsrm,
} from "../../../../../_entities/bus-line.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  displayLineMode,
  displayLineModeEnum,
} from "../../../board/component/organism/DrawModeBoardContent";
import { setStopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { setIsOverMapItem } from "../../l7MapBuilder";
import {
  blinkingStops,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
  setCursorIsOverPoint,
} from "../organism/Points";
import { draggingLine, setDraggingLine } from "./BusLine";

const [
  ,
  {
    isInReadMode,
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
    removePointToLineUnderConstruction,
    setLineUnderConstruction,
  },
] = useStateAction();

export interface StopPointProps {
  point: StopType;
  map: L.Map;

  minQuantity: number;
  maxQuantity: number;
}
const minRadius = 5;
const maxRadius = 10;
const rangeRadius = maxRadius - minRadius;

//TODO Modify when we use multiple schools
function getAssociatedQuantity(point: StopType) {
  return point.associated.filter(
    (associatedSchool) =>
      associatedSchool.id === getLineUnderConstruction().busLine.schools[0].id
  )[0].quantity;
}

function updateWaypoints(point: StopType) {
  const actualWaypoints = getLineUnderConstruction().busLine.waypoints;
  if (actualWaypoints) {
    const waypoints = WaypointEntity.updateWaypoints(
      point,
      actualWaypoints,
      getLineUnderConstruction().busLine.points
    );
    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: {
        ...getLineUnderConstruction().busLine,
        waypoints,
      },
    });
  }
}

function onClick(point: StopType) {
  if (onBoard() != "line-draw") {
    deselectAllBusLines();
    deselectAllPoints();
    point.setSelected(true);
    setStopDetailsItem(point);
    changeBoard("stop-details");
    updatePointColor(point);

    return;
  }

  const associatedQuantity = getAssociatedQuantity(point);

  // TODO: when add line with an etablissement point the line destroy after next point click
  // Wait Richard/Hugo finish the line underconstruction
  const lastPoint = getLineUnderConstruction().busLine.points.at(-1);
  addPointToLineUnderConstruction({ ...point, quantity: associatedQuantity });
  if (!lastPoint || point.leafletId != lastPoint.leafletId) {
    updateWaypoints(point);
    if (displayLineMode() == displayLineModeEnum.onRoad) {
      updatePolylineWithOsrm(getLineUnderConstruction().busLine);
    }
  }

  //TODO pourquoi cette condition ?
  if (!(1 < getLineUnderConstruction().busLine.points.length)) {
    return;
  }
  console.log("waypoints", getLineUnderConstruction().busLine.waypoints);
  console.log("points", getLineUnderConstruction().busLine.points);
}

const onMouseOver = (stop: StopType) => {
  setIsOverMapItem(true);
  setBlinkingSchools(stop.associated.map((school) => school.id));

  if (draggingLine()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = () => {
  setIsOverMapItem(false);
  setBlinkingSchools([]);

  if (draggingLine() || cursorIsOverPoint()) {
    setCursorIsOverPoint(false);
  }
};

const onMouseUp = (point: StopType) => {
  if (draggingLine()) {
    const associatedQuantity = getAssociatedQuantity(point);

    addPointToLineUnderConstruction({ ...point, quantity: associatedQuantity });
    updateWaypoints(point);

    setDraggingLine(false);
  }
};

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

  const onRightClick = () => {
    const circle = linkMap.get(props.point.leafletId);
    const isInLineUnderConstruction =
      getLineUnderConstruction().busLine.points.filter(
        (_point) => _point.id == props.point.id
      )[0];

    if (onBoard() == "line-draw" && isInLineUnderConstruction != undefined) {
      removePointToLineUnderConstruction(props.point);
      // Update waypoints
      const waypoints = getLineUnderConstruction().busLine.waypoints;
      if (waypoints) {
        const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
          waypoints,
          props.point.id,
          props.point.nature
        );

        const newBusLine: BusLineType = {
          ...getLineUnderConstruction().busLine,
          waypoints: newWaypoints,
        };
        if (displayLineMode() == displayLineModeEnum.onRoad) {
          updatePolylineWithOsrm(newBusLine);
        } else {
          setLineUnderConstruction({
            ...getLineUnderConstruction(),
            busLine: newBusLine,
          });
        }
      }

      circle?.setStyle({ fillColor: COLOR_STOP_FOCUS });
    }
  };

  const color = () => {
    if (isInAddLineMode()) {
      return COLOR_STOP_LIGHT;
    } else return COLOR_STOP_FOCUS;
  };

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingStops().includes(props.point.id)}
      borderColor={color()}
      fillColor={color()}
      radius={rad()}
      weight={0}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
      onRightClick={onRightClick}
      onMouseUp={() => onMouseUp(props.point)}
    />
  );
}
