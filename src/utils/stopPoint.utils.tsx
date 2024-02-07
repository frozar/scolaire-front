import { GradeTripType } from "../_entities/grade.entity";
import { StopType } from "../_entities/stop.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { WaypointEntity } from "../_entities/waypoint.entity";
import { updatePointColor } from "../leafletUtils";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../type";
import {
  addLineCheckableStop,
  setAddLineCheckableStop,
} from "../views/content/board/component/organism/AddLineBoardContent";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
  setCurrentTripIndex,
} from "../views/content/board/component/organism/DrawTripBoard";
import {
  changeBoard,
  onBoard,
} from "../views/content/board/component/template/ContextManager";
import {
  draggingWaypointIndex,
  setDraggingWaypointIndex,
} from "../views/content/map/component/atom/PolylineDragMarker";
import {
  draggingTrip,
  setDraggingTrip,
} from "../views/content/map/component/molecule/Trip";
import {
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
  setCursorIsOverPoint,
} from "../views/content/map/component/organism/Points";
import {
  COLOR_STOP_FOCUS,
  COLOR_WAYPOINT,
} from "../views/content/map/constant";
import { setIsOverMapItem } from "../views/content/map/l7MapBuilder";
import {
  currentDrawPath,
  drawPathUtils,
} from "../views/content/path/component/drawPath.utils";
import { setStopDetailsItem } from "../views/content/stops/component/organism/StopDetails";
import { CurrentDrawTripUtils } from "./currentDrawTrip.utils";
import { TripUtils } from "./trip.utils";

export namespace StopPointUtil {
  function updateTripAndWaypoints(point: StopType) {
    const lastPoint = currentDrawTrip().tripPoints.at(-1);

    const gradeIds = currentDrawTrip().grades.map(
      (grade) => grade.id
    ) as number[];

    const grades: GradeTripType[] = [];
    point.associated.map((associated) => {
      if (gradeIds.includes(associated.gradeId)) {
        grades.push({
          quantity: associated.quantity,
          gradeId: associated.gradeId,
          matrix: associated.quantityMatrix,
        });
      }
    });
    CurrentDrawTripUtils.addPointToTrip({
      ...point,
      grades: grades,
      passageTime: 0,
      startToTripPointDistance: 0,
    });

    if (!lastPoint || point.leafletId != lastPoint.leafletId) {
      const waypoints = currentDrawTrip().waypoints;
      if (waypoints) {
        const newWaypoints = WaypointEntity.updateWaypoints(
          point,
          waypoints,
          currentDrawTrip().tripPoints
        );
        CurrentDrawTripUtils.updateWaypoints(newWaypoints);
      }
    }
  }

  export function onClick(point: StopType) {
    switch (onBoard()) {
      case "line-add":
        setAddLineCheckableStop([
          ...addLineCheckableStop().map((stop) => {
            if (stop.item.id == point.id) {
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

          case DrawTripStep.buildReverse:
          case DrawTripStep.editTrip:
            const tripDirection = TripDirectionEntity.FindDirectionById(
              currentDrawTrip().tripDirectionId
            ).type;

            const firstPointOfTrip = currentDrawTrip().tripPoints.length == 0;

            if (tripDirection == TripDirectionEnum.coming && firstPointOfTrip) {
              return addNewUserInformation({
                displayed: true,
                level: MessageLevelEnum.error,
                type: MessageTypeEnum.global,
                content:
                  "Veuillez sélectionner une école pour débuter votre course et finir sur une arrêt.",
              });
            }

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

  export function onMouseOver(stop: StopType) {
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
  }

  export function onMouseOut(stop: StopType) {
    if (draggingWaypointIndex()) {
      const circle = linkMap.get(stop.leafletId);
      circle?.setStyle({ radius: 5, weight: 0, color: COLOR_STOP_FOCUS });
    }
    setIsOverMapItem(false);
    setBlinkingSchools([]);

    if (draggingTrip() || cursorIsOverPoint()) {
      setCursorIsOverPoint(false);
    }
  }

  export function pointAlreadyExistInPathOrTrip(stop: StopType): boolean {
    switch (onBoard()) {
      case "trip-draw":
        return currentDrawTrip()
          .tripPoints.map((point) => point.id)
          .includes(stop.id);
      case "path-draw":
        return (
          currentDrawPath()
            ?.points.map((point) => point.id)
            .includes(stop.id) ?? false
        );
      default:
        return false;
    }
  }

  export function updatePathOrTripPoints(stop: StopType) {
    switch (onBoard()) {
      case "trip-draw":
        updateTripAndWaypoints(stop);
        break;
      case "path-draw":
        drawPathUtils.addPointToPath(stop);
      default:
        return false;
    }
  }

  export function onMouseUp(stop: StopType, map: L.Map) {
    const nextIndex = draggingWaypointIndex();
    if (nextIndex) {
      // case mouseUp on a stop not already in the trip
      if (!pointAlreadyExistInPathOrTrip(stop)) {
        setCurrentTripIndex(nextIndex);
        updatePathOrTripPoints(stop);

        const circle = linkMap.get(stop.leafletId);
        circle?.setStyle({ radius: 5, weight: 0 });
      } else {
        const lastIndex =
          onBoard() == "trip-draw"
            ? currentDrawTrip().tripPoints.length
            : currentDrawPath()?.points.length ?? -1;

        setCurrentTripIndex(lastIndex);
        map.off("mousemove");
      }
      setDraggingWaypointIndex();
      map.dragging.enable();
    } else if (draggingTrip()) {
      updatePathOrTripPoints(stop);
      setDraggingTrip(false);
    }
  }

  export function onRightClick(stop: StopType) {
    const circle = linkMap.get(stop.leafletId);
    const isInTripUnderConstruction = currentDrawTrip().tripPoints.filter(
      (_point) => _point.id == stop.id
    )[0];

    if (onBoard() == "trip-draw" && isInTripUnderConstruction != undefined) {
      if (TripUtils.canRemoveStopFromTrip(stop.leafletId)) return;

      CurrentDrawTripUtils.removePoint(stop);

      // Update waypoints
      const waypoints = currentDrawTrip().waypoints;
      if (waypoints) {
        const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
          waypoints,
          stop.id,
          stop.nature
        );
        CurrentDrawTripUtils.updateWaypoints(newWaypoints);
      }

      circle?.setStyle({ fillColor: COLOR_STOP_FOCUS });

      CurrentDrawTripUtils.removeTripPoint(stop.id, stop.nature);
    }
  }
}
