import { SchoolType } from "../../../../_entities/school.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { WaypointEntity } from "../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../leafletUtils";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { CurrentDrawTripUtils } from "../../../../utils/currentDrawTrip.utils";
import { TripUtils } from "../../../../utils/trip.utils";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
  setaddLineSelectedSchool,
} from "../../board/component/organism/AddLineBoardContent";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
  setCurrentTripIndex,
} from "../../board/component/organism/DrawTripBoard";
import {
  changeBoard,
  onBoard,
} from "../../board/component/template/ContextManager";
import {
  currentDrawPath,
  drawPathUtils,
} from "../../path/component/drawPath.utils";
import { setSchoolDetailsItem } from "../../schools/component/organism/SchoolDetails";
import { COLOR_SCHOOL_FOCUS, COLOR_SCHOOL_LIGHT } from "../constant";
import { setIsOverMapItem } from "../l7MapBuilder";
import { draggingTrip, setDraggingTrip } from "./molecule/Trip";
import {
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
  setCursorIsOverPoint,
} from "./organism/Points";

export namespace SchoolPointUtils {
  export function onClick(point: SchoolType) {
    const schoolsSelected = currentDrawTrip().schools;
    switch (onBoard()) {
      case "path-draw":
        setCurrentTripIndex(currentDrawPath()?.points.length as number);
        drawPathUtils.addPointToPath({ id: point.id, nature: point.nature });
        break;
      case "line-add":
        switch (addLineCurrentStep()) {
          case AddLineStep.schoolSelection:
            const currentSelectedSchools = [...addLineSelectedSchool()];

            const index = currentSelectedSchools.indexOf(point, 0);

            const circle = linkMap.get(point.leafletId);

            if (index > -1) {
              currentSelectedSchools.splice(index, 1);
              setaddLineSelectedSchool(currentSelectedSchools);
              circle?.setStyle({ fillColor: COLOR_SCHOOL_LIGHT });
            } else {
              setaddLineSelectedSchool([...currentSelectedSchools, point]);
              circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
            }
            break;

          case AddLineStep.schoolSelection:
            return;
        }
        break;

      case "line-details":
        //TODO display school informations
        console.log("TODO display school informations");
        return;

      case "trip-draw":
        switch (currentStep()) {
          case DrawTripStep.schoolSelection:
            if (!point.calendar) {
              addNewUserInformation({
                displayed: true,
                level: MessageLevelEnum.error,
                type: MessageTypeEnum.global,
                content: "Cette école n'a pas de calendrier assigné",
              });
              return;
            }

            if (schoolsSelected?.find((p) => p.id === point.id)) {
              return;
            }
            CurrentDrawTripUtils.addSchoolToTrip(point);
            return;

          case DrawTripStep.buildReverse:
          case DrawTripStep.editTrip:
            const tripDirection = TripDirectionEntity.FindDirectionById(
              currentDrawTrip().tripDirectionId
            ).type;

            const firstPointOfTrip = currentDrawTrip().tripPoints.length == 0;

            if (tripDirection == TripDirectionEnum.going && firstPointOfTrip) {
              return addNewUserInformation({
                displayed: true,
                level: MessageLevelEnum.error,
                type: MessageTypeEnum.global,
                content:
                  "Veuillez séléctionner un arrêt pour débuter votre course et finir sur une école.",
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
        setSchoolDetailsItem(point);
        changeBoard("school-details");
        updatePointColor(point);
    }
  }

  // TODO: Rename and move ?
  export function updateTripAndWaypoints(school: SchoolType) {
    const lastPoint = currentDrawTrip().tripPoints.at(-1);

    // TODO add quantity pour school ?!
    CurrentDrawTripUtils.addPointToTrip({
      id: school.id,
      leafletId: school.leafletId,
      name: school.name,
      lon: school.lon,
      lat: school.lat,
      nature: school.nature,
      grades: [],
      passageTime: 0,
      startToTripPointDistance: 0,
    });

    if (!lastPoint || school.leafletId != lastPoint.leafletId) {
      const waypoints = currentDrawTrip().waypoints;
      if (waypoints) {
        const newWaypoints = WaypointEntity.updateWaypoints(
          school,
          waypoints,
          currentDrawTrip().tripPoints
        );

        CurrentDrawTripUtils.updateWaypoints(newWaypoints);
      }
    }
  }
  export function onMouseUp(school: SchoolType) {
    if (draggingTrip()) {
      updateTripAndWaypoints(school);
      setDraggingTrip(false);
    }
  }

  export function onMouseOver(school: SchoolType) {
    setIsOverMapItem(true);
    setBlinkingStops(school.associated.map((stop) => stop.schoolId));

    if (draggingTrip()) {
      setCursorIsOverPoint(true);
    }
  }

  export function onMouseOut() {
    setIsOverMapItem(false);
    setBlinkingStops([]);

    if (draggingTrip() || cursorIsOverPoint()) {
      setCursorIsOverPoint(false);
    }
  }

  export function onRightClick(point: SchoolType) {
    const circle = linkMap.get(point.leafletId);
    const isInTripUnderConstruction = currentDrawTrip().tripPoints.filter(
      (_point) => _point.id == point.id
    )[0];

    switch (onBoard()) {
      case "trip-draw":
        if (isInTripUnderConstruction == undefined) break;
        if (TripUtils.canRemoveSchoolPointFromTrip(point.leafletId)) return;
        CurrentDrawTripUtils.removePoint(point);

        const waypoints = currentDrawTrip().waypoints;
        if (waypoints) {
          const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
            waypoints,
            point.id,
            point.nature
          );
          CurrentDrawTripUtils.updateWaypoints(newWaypoints);
        }

        circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
        CurrentDrawTripUtils.removeTripPoint(point.id, point.nature);
        break;
      case "path-draw":
        drawPathUtils.removePoint(point.id);
        break;
    }
  }
}