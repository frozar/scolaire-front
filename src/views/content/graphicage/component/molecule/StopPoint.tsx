import L from "leaflet";
import { createEffect } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../../../leafletUtils";
import { onBoard } from "../../../../layout/component/organism/ContextManager";
import {
  COLOR_SCHOOL_LIGHT,
  COLOR_STOP_EMPHASE,
  COLOR_STOP_FOCUS,
  COLOR_STOP_LIGHT,
} from "../../constant";
import Point from "../atom/Point";
import { deselectAllBusLines } from "../organism/BusLines";
import {
  displayLineMode,
  displayLineModeEnum,
} from "../organism/DrawModeBoardContent";
import {
  blinkingStops,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
  setCursorIsOverPoint,
} from "../organism/Points";
import { getSchools } from "../organism/SchoolPoints";
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
  // ! Comparer si entre point i - 1 et i + 1 il y a un waypoint, si oui le splice
  // const points = getLineUnderConstruction().busLine.points;
  // if (points) {
  // let idPointBefore = 0;
  // let idPointAfter = 0;
  const waypoints = getLineUnderConstruction().busLine.waypoints;
  if (waypoints) {
    // ! Récup les ids des points avant et après
    const index = getLineUnderConstruction().busLine.points.findIndex(
      (actualPoint) => actualPoint.id == point.id
    );
    // ! Refactor
    if (getLineUnderConstruction().busLine.points.length < index + 2) {
      const newWaypoints = [...waypoints];
      console.log("oldWaypoint =>", waypoints);
      // ! Et ajouter le waypoint correspondant au nouveau point en même temps!
      newWaypoints.push({
        idStop: point.id,
        lat: point.lat,
        lon: point.lon,
      });
      console.log("new Waypoint =>", newWaypoints);

      setLineUnderConstruction({
        ...getLineUnderConstruction(),
        busLine: {
          ...getLineUnderConstruction().busLine,
          waypoints: newWaypoints,
        },
      });
      return;
    }
    console.log("index", index);
    const idPointBefore =
      getLineUnderConstruction().busLine.points[index - 1].id;
    const idPointAfter =
      getLineUnderConstruction().busLine.points[index + 1].id;
    console.log("idPointBefore", idPointBefore);
    console.log("idPointAfter", idPointAfter);

    // ! Delete (splice) les waypoints entre ces deux points !
    const pointBeforeIndexWaypoint = waypoints.findIndex(
      (actualPoint) => actualPoint.idStop == idPointBefore
    );
    const pointAfterIndexWaypoint = waypoints.findIndex(
      (actualPoint) => actualPoint.idStop == idPointAfter
    );
    const difference = pointAfterIndexWaypoint - pointBeforeIndexWaypoint;

    let toDelete = 0;
    if (difference > 1) {
      toDelete = difference - 1;
    }
    // if (difference > 1) {
    // let waypoints = getLineUnderConstruction().busLine
    // .waypoints as WaypointType[];
    const newWaypoints = [...waypoints];
    console.log("oldWaypoint =>", waypoints);
    // ! Et ajouter le waypoint correspondant au nouveau point en même temps!
    newWaypoints.splice(pointBeforeIndexWaypoint + 1, toDelete, {
      idStop: point.id,
      lat: point.lat,
      lon: point.lon,
    });
    console.log("new Waypoint =>", newWaypoints);

    setLineUnderConstruction({
      ...getLineUnderConstruction(),
      busLine: {
        ...getLineUnderConstruction().busLine,
        waypoints: newWaypoints,
      },
    });
    // } else {
    //   // ! sinon simplement ajouter le point dans le waypoint ! WIP
    //   const newWaypoints = [...waypoints];
    //   console.log("oldWaypoint =>", waypoints);
    //   newWaypoints.splice(pointBeforeIndexWaypoint + 1, 0, {
    //     idStop: point.id,
    //     lat: point.lat,
    //     lon: point.lon,
    //   });
    //   console.log("new Waypoint =>", newWaypoints);
    //   setLineUnderConstruction({
    //     ...getLineUnderConstruction(),
    //     busLine: {
    //       ...getLineUnderConstruction().busLine,
    //       waypoints: newWaypoints,
    //     },
    //   });
    // }
  }

  // const testIdPointBefore = points.map((actualPoint) => {
  //   if (actualPoint.id == point.id) {
  //     const index = points.findIndex((point) => point.)
  //   }
  // })
  // for (let i = 0; points.length - 1; i++) {
  //   if (points[i].id == point.id) {
  //     idPointBefore = i - 1;
  //     idPointAfter = i + 1;
  //   }
  // }
  // }
  console.log("point", point);
  console.log("getLineUnderConstruction()", getLineUnderConstruction());
}

function onClick(point: StopType) {
  // Highlight point schools
  const ids: number[] = [point.leafletId];
  for (const associated of point.associated) {
    const leafletPoint = getSchools().filter(
      (item) => item.id == associated.id
    )[0];
    ids.push(leafletPoint.leafletId);
  }

  // For all point that is not in ids set the color
  setSchoolPointsColor(ids, COLOR_SCHOOL_LIGHT);
  setStopPointsColor(ids, COLOR_STOP_LIGHT);

  if (onBoard() != "draw-line") {
    deselectAllBusLines();
    deselectAllPoints();
    point.setSelected(true);
    return;
  }

  const associatedQuantity = getAssociatedQuantity(point);

  // TODO: when add line with an etablissement point the line destroy after next point click
  // Wait Richard/Hugo finish the line underconstruction
  if (displayLineMode() == displayLineModeEnum.straight) {
    addPointToLineUnderConstruction({ ...point, quantity: associatedQuantity });
    updateWaypoints(point);
  }

  //TODO pourquoi cette condition ?
  if (!(1 < getLineUnderConstruction().busLine.points.length)) {
    return;
  }
}

const onMouseOver = (stop: StopType) => {
  setBlinkingSchools(stop.associated.map((school) => school.id));

  if (draggingLine()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = () => {
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

    if (isInAddLineMode() && isInLineUnderConstruction != undefined) {
      removePointToLineUnderConstruction(props.point);
      const waypoints = getLineUnderConstruction().busLine.waypoints;
      if (waypoints) {
        const waypointIndex = waypoints.findIndex(
          (waypoint) => waypoint.idStop == props.point.id
        );

        const newWaypoints = [...waypoints];
        newWaypoints.splice(waypointIndex, 1);

        setLineUnderConstruction({
          ...getLineUnderConstruction(),
          busLine: {
            ...getLineUnderConstruction().busLine,
            waypoints: newWaypoints,
          },
        });
      }

      circle?.setStyle({ fillColor: COLOR_STOP_LIGHT });
    }
  };

  createEffect(() => {
    if (isInAddLineMode()) {
      const circle = linkMap.get(props.point.leafletId);
      circle?.setStyle({ fillColor: COLOR_STOP_EMPHASE });
    }
  });
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
