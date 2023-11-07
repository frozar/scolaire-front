import L from "leaflet";
import { createEffect } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import { CurrentDrawTripUtils } from "../../../../../utils/currentDrawTrip.utils";
import {
  AddLineStep,
  addLineCurrentStep,
  addLineSelectedSchool,
  setaddLineSelectedSchool,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
} from "../../../board/component/organism/DrawTripBoard";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../../../schools/component/organism/SchoolDetails";
import { COLOR_SCHOOL_FOCUS, COLOR_SCHOOL_LIGHT } from "../../constant";
import { setIsOverMapItem } from "../../l7MapBuilder";
import Point from "../atom/Point";
import {
  blinkingSchools,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingStops,
  setCursorIsOverPoint,
} from "../organism/Points";
import { draggingTrip, setDraggingTrip } from "./Trip";

export interface SchoolPointProps {
  point: SchoolType;
  map: L.Map;
}

const onClick = (point: SchoolType) => {
  const schoolsSelected = currentDrawTrip().schools;
  switch (onBoard()) {
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
          if (schoolsSelected?.find((p) => p.id === point.id)) {
            return;
          }
          CurrentDrawTripUtils.addSchoolToTrip(point);
          return;

        case DrawTripStep.editTrip:
          const lastPoint = currentDrawTrip().tripPoints.at(-1);

          // TODO  add quantity pour school ?!
          CurrentDrawTripUtils.addPointToTrip({
            id: point.id,
            leafletId: point.leafletId,
            name: point.name,
            lon: point.lon,
            lat: point.lat,
            quantity: 0, // TODO: Delete when unused
            nature: point.nature,
            grades: [],
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
};

const onMouseUp = (point: StopType) => {
  if (draggingTrip()) {
    const associatedQuantity = point.associated.filter(
      (associatedSchool) =>
        associatedSchool.schoolId === currentDrawTrip().schools[0].id
    )[0].quantity;

    // TODO  add quantity pour school ?!
    // TODO: Fix or delete this handler if school must always be at the end of a trip
    CurrentDrawTripUtils.addPointToTrip({
      ...point,
      quantity: associatedQuantity,
    });
    setDraggingTrip(false);
  }
};

const onMouseOver = (school: SchoolType) => {
  setIsOverMapItem(true);
  setBlinkingStops(school.associated.map((stop) => stop.schoolId));

  if (draggingTrip()) {
    setCursorIsOverPoint(true);
  }
};

const onMouseOut = () => {
  setIsOverMapItem(false);
  setBlinkingStops([]);

  if (draggingTrip() || cursorIsOverPoint()) {
    setCursorIsOverPoint(false);
  }
};

const onRightClick = (point: SchoolType) => {
  const circle = linkMap.get(point.leafletId);
  const isInTripUnderConstruction = currentDrawTrip().tripPoints.filter(
    (_point) => _point.id == point.id
  )[0];

  if (onBoard() == "trip-draw" && isInTripUnderConstruction != undefined) {
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
  }
};

export function SchoolPoint(props: SchoolPointProps) {
  createEffect(() => {
    //TODO dont Work

    if (addLineCurrentStep() === AddLineStep.schoolSelection) {
      const stopFiltering = addLineSelectedSchool().filter(
        (school) => school.id == props.point.id
      );
      const circle = linkMap.get(props.point.leafletId);
      if (stopFiltering.length > 0) {
        circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
      } else {
        circle?.setStyle({ fillColor: COLOR_SCHOOL_LIGHT });
      }
    }
  });

  return (
    <Point
      point={props.point}
      map={props.map}
      isBlinking={blinkingSchools().includes(props.point.id)}
      borderColor={COLOR_SCHOOL_FOCUS}
      fillColor={COLOR_SCHOOL_FOCUS}
      radius={12}
      weight={0}
      onClick={() => onClick(props.point)}
      onMouseOver={() => onMouseOver(props.point)}
      onMouseOut={() => onMouseOut()}
      onMouseUp={() => onMouseUp(props.point)}
      onRightClick={() => onRightClick(props.point)}
    />
  );
}
