import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import { COLOR_STOP_FOCUS, COLOR_WAYPOINT } from "../../constant";
import Point from "../atom/Point";

import { GradeTripType } from "../../../../../_entities/grade.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  setStopSelected,
  stopSelected,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawTripStep,
  addPointToTrip,
  currentDrawTrip,
  currentStep,
  removePoint,
  setCurrentTripIndex,
  updateWaypoints,
} from "../../../board/component/organism/DrawTripBoard";
import { setStopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { setIsOverMapItem } from "../../l7MapBuilder";
import {
  draggingWaypointIndex,
  setDraggingWaypointIndex,
} from "../atom/PolylineDragMarker";
import { getLines } from "../organism/BusLines";
import {
  blinkingStops,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
  setCursorIsOverPoint,
} from "../organism/Points";
import { draggingTrip, setDraggingTrip } from "./Trip";

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

//TODO Ne doit pas être placé ici
// TODO: FIX
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAssociatedQuantity(point: StopType) {
  return point.associated.filter(
    (associatedSchool) =>
      associatedSchool.schoolId === currentDrawTrip().schools[0].id
  )[0].quantity;
}

function updateTripAndWaypoints(point: StopType) {
  const lastPoint = currentDrawTrip().tripPoints.at(-1);

  // TODO: Setup filter (selected grades during drawTrip creation)
  const targetSchoolId = currentDrawTrip().schools[0].id; // TODO: Delete when filter is setup
  const grades: GradeTripType[] = [];
  point.associated.map((associated) => {
    if (associated.schoolId == targetSchoolId) {
      grades.push({
        quantity: associated.quantity,
        gradeId: associated.gradeId,
      });
    }
  });

  // TODO: Refactor, move and rename
  function updateGradesWithRemainingQuantity(
    grades: GradeTripType[],
    point: StopType
  ): GradeTripType[] {
    // Get all corresponding gradeTrip
    const gradeTrips = getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter((tripPoint) => tripPoint.id == point.id)
      .flatMap((_tripPoint) => _tripPoint.grades);

    // Substract used quantity
    grades.forEach((grade) => {
      gradeTrips.forEach((_gradeTrip) => {
        if (_gradeTrip.gradeId == grade.gradeId) {
          grade.quantity -= _gradeTrip.quantity;
        }
      });
    });
    return grades;
  }

  addPointToTrip({
    id: point.id,
    leafletId: point.leafletId,
    name: point.name,
    lon: point.lon,
    lat: point.lat,
    quantity: 1, // TODO: Delete when unused
    nature: point.nature,
    grades: updateGradesWithRemainingQuantity(grades, point),
  });

  if (!lastPoint || point.leafletId != lastPoint.leafletId) {
    const waypoints = currentDrawTrip().waypoints;
    if (waypoints) {
      const newWaypoints = WaypointEntity.updateWaypoints(
        point,
        waypoints,
        currentDrawTrip().tripPoints
      );
      updateWaypoints(newWaypoints);
    }
  }
}

function onClick(point: StopType) {
  switch (onBoard()) {
    case "line-add":
      setStopSelected([
        ...stopSelected().map((stop) => {
          if (stop.stopItem.id == point.id) {
            return { ...stop, done: !stop.done };
          }
          return stop;
        }),
      ]);
      break;
    case "line-details":
      //TODO display stop informations
      console.log("TODO display stop informations");
      return;
    case "trip-draw":
      switch (currentStep()) {
        case DrawTripStep.schoolSelection:
          return;

        case DrawTripStep.editTrip:
          updateTripAndWaypoints(point);
          break;
      }
      break;
    default:
      // deselectAllTrips();
      deselectAllPoints();
      point.setSelected(true);
      setStopDetailsItem(point);
      changeBoard("stop-details");
      updatePointColor(point);
  }
}

const onMouseOver = (stop: StopType) => {
  if (
    draggingWaypointIndex() &&
    !currentDrawTrip()
      .tripPoints.map((point) => point.id)
      .includes(stop.id)
  ) {
    const circle = linkMap.get(stop.leafletId);
    circle?.setStyle({ radius: 10, weight: 4, color: COLOR_WAYPOINT });
  }
  setIsOverMapItem(true);
  setBlinkingSchools(stop.associated.map((school) => school.schoolId));

  if (draggingTrip()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = (stop: StopType) => {
  if (draggingWaypointIndex()) {
    const circle = linkMap.get(stop.leafletId);
    circle?.setStyle({ radius: 5, weight: 0, color: COLOR_STOP_FOCUS });
  }
  setIsOverMapItem(false);
  setBlinkingSchools([]);

  if (draggingTrip() || cursorIsOverPoint()) {
    setCursorIsOverPoint(false);
  }
};

const onMouseUp = (stop: StopType, map: L.Map) => {
  const nextIndex = draggingWaypointIndex();
  if (nextIndex) {
    // case mouseUp on a stop not already in the trip
    if (
      !currentDrawTrip()
        .tripPoints.map((point) => point.id)
        .includes(stop.id)
    ) {
      setDraggingWaypointIndex();
      setCurrentTripIndex(nextIndex);

      updateTripAndWaypoints(stop);

      const circle = linkMap.get(stop.leafletId);
      circle?.setStyle({ radius: 5, weight: 0 });
    } else {
      setCurrentTripIndex(currentDrawTrip().tripPoints.length);
      setDraggingWaypointIndex();
      map.off("mousemove");
    }
    map.dragging.enable();
  } else if (draggingTrip()) {
    updateTripAndWaypoints(stop);

    setDraggingTrip(false);
  }
};

const onRightClick = (stop: StopType) => {
  const circle = linkMap.get(stop.leafletId);
  const isInTripUnderConstruction = currentDrawTrip().tripPoints.filter(
    (_point) => _point.id == stop.id
  )[0];

  if (onBoard() == "trip-draw" && isInTripUnderConstruction != undefined) {
    removePoint(stop);

    // Update waypoints
    const waypoints = currentDrawTrip().waypoints;
    if (waypoints) {
      const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
        waypoints,
        stop.id,
        stop.nature
      );
      updateWaypoints(newWaypoints);
    }

    circle?.setStyle({ fillColor: COLOR_STOP_FOCUS });
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

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingStops().includes(props.point.id)}
      borderColor={COLOR_STOP_FOCUS}
      fillColor={COLOR_STOP_FOCUS}
      radius={rad()}
      weight={0}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut(props.point)}
      onRightClick={() => onRightClick(props.point)}
      onMouseUp={() => onMouseUp(props.point, props.map)}
    />
  );
}
