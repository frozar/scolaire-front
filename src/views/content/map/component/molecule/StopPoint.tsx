import L from "leaflet";
import { useStateAction } from "../../../../../StateAction";
import { StopType } from "../../../../../_entities/stop.entity";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import {
  COLOR_STOP_FOCUS,
  COLOR_STOP_LIGHT,
  COLOR_WAYPOINT,
} from "../../constant";
import Point from "../atom/Point";

import { WaypointEntity } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import {
  setStopSelected,
  stopSelected,
} from "../../../board/component/organism/AddLineBoardContent";
import {
  DrawRaceStep,
  addPointToRace,
  currentRace,
  currentStep,
  removePoint,
  setCurrentRaceIndex,
  updateWaypoints,
} from "../../../board/component/organism/DrawRaceBoard";
import { setStopDetailsItem } from "../../../stops/component/organism/StopDetails";
import { setIsOverMapItem } from "../../l7MapBuilder";
import {
  draggingWaypointIndex,
  setDraggingWaypointIndex,
} from "../atom/PolylineDragMarker";
import {
  blinkingStops,
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
  setBlinkingSchools,
  setCursorIsOverPoint,
} from "../organism/Points";
import { draggingRace, setDraggingRace } from "./Race";

const [, { isInReadMode, isInDrawRaceMode }] = useStateAction();

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
function getAssociatedQuantity(point: StopType) {
  return point.associated.filter(
    (associatedSchool) =>
      associatedSchool.schoolId === currentRace().schools[0].id
  )[0].quantity;
}

function onClick(point: StopType) {
  switch (onBoard()) {
    case "line-add":
      setStopSelected([
        ...stopSelected().map((stop) => {
          if (stop.associated.id == point.id) {
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
    case "race-draw":
      switch (currentStep()) {
        case DrawRaceStep.schoolSelection:
          return;

        case DrawRaceStep.editRace:
          // TODO: FIX
          // const associatedQuantity = getAssociatedQuantity(point);
          const associatedQuantity = 1;
          const lastPoint = currentRace().points.at(-1);

          addPointToRace({ ...point, quantity: associatedQuantity });

          if (!lastPoint || point.leafletId != lastPoint.leafletId) {
            const waypoints = currentRace().waypoints;
            if (waypoints) {
              const newWaypoints = WaypointEntity.updateWaypoints(
                point,
                waypoints,
                currentRace().points
              );
              updateWaypoints(newWaypoints);
            }
          }
          break;
      }
      break;
    default:
      // deselectAllRaces();
      deselectAllPoints();
      point.setSelected(true);
      setStopDetailsItem(point);
      changeBoard("stop-details");
      updatePointColor(point);
  }
}

// const onMouseOver = (stop: StopType) => {
//   if (isDraggingWaypoint()) {
//     const circle = linkMap.get(props.point.leafletId);

//   }
//   setIsOverMapItem(true);
//   setBlinkingSchools(stop.associated.map((school) => school.schoolId));

//   if (draggingRace()) {
//     setCursorIsOverPoint(true);
//   }
// };

// const onMouseOut = () => {
//   setIsOverMapItem(false);
//   setBlinkingSchools([]);

//   if (draggingRace() || cursorIsOverPoint()) {
//     setCursorIsOverPoint(false);
//   }
// };

// const onMouseUp = (point: StopType) => {
//   console.log("mouseUp stop")
//   if (draggingWaypointNextIndex()) {
//     // console.log("mouseout point");
//     const circle = linkMap.get(props.point.leafletId);
//     circle?.setStyle({ radius: 5, weight: 0 }); // ! reset color ?
//   }

//   if (draggingRace()) {
//     const associatedQuantity = getAssociatedQuantity(point);

//     addPointToRace({ ...point, quantity: associatedQuantity });

//     const waypoints = currentRace().waypoints;
//     if (waypoints) {
//       const newWaypoints = WaypointEntity.updateWaypoints(
//         point,
//         waypoints,
//         currentRace().points
//       );
//       updateWaypoints(newWaypoints);
//     }

//     setDraggingRace(false);
//   }
// };

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
    const isInRaceUnderConstruction = currentRace().points.filter(
      (_point) => _point.id == props.point.id
    )[0];

    if (onBoard() == "race-draw" && isInRaceUnderConstruction != undefined) {
      removePoint(props.point);

      // Update waypoints
      const waypoints = currentRace().waypoints;
      if (waypoints) {
        const newWaypoints = WaypointEntity.deleteSchoolOrStopWaypoint(
          waypoints,
          props.point.id,
          props.point.nature
        );
        updateWaypoints(newWaypoints);
      }

      circle?.setStyle({ fillColor: COLOR_STOP_FOCUS });
    }
  };

  const onMouseOver = (stop: StopType) => {
    if (
      draggingWaypointIndex() &&
      !currentRace()
        .points.map((point) => point.id)
        .includes(stop.id)
    ) {
      const circle = linkMap.get(props.point.leafletId);
      circle?.setStyle({ radius: 10, weight: 4, color: COLOR_WAYPOINT });
    }
    setIsOverMapItem(true);
    setBlinkingSchools(stop.associated.map((school) => school.schoolId));

    if (draggingRace()) {
      setCursorIsOverPoint(true);
    }
  };

  const onMouseOut = () => {
    if (draggingWaypointIndex()) {
      const circle = linkMap.get(props.point.leafletId);
      // ! Reset seulement si necessaire, vérif d'abord
      circle?.setStyle({ radius: 5, weight: 0 }); // ! reset color ?
    }
    setIsOverMapItem(false);
    setBlinkingSchools([]);

    if (draggingRace() || cursorIsOverPoint()) {
      setCursorIsOverPoint(false);
    }
  };

  const onMouseUp = (point: StopType) => {
    const nextIndex = draggingWaypointIndex();
    if (
      nextIndex &&
      !currentRace()
        .points.map((point) => point.id)
        .includes(point.id)
    ) {
      setDraggingWaypointIndex();
      console.log("nextIndex", nextIndex);
      console.log("mouseUp stop");
      setCurrentRaceIndex(nextIndex);

      const associatedQuantity = 1;
      const lastPoint = currentRace().points.at(-1);

      addPointToRace({ ...point, quantity: associatedQuantity });

      if (!lastPoint || point.leafletId != lastPoint.leafletId) {
        const waypoints = currentRace().waypoints;
        if (waypoints) {
          const newWaypoints = WaypointEntity.updateWaypoints(
            point,
            waypoints,
            currentRace().points
          );
          updateWaypoints(newWaypoints);
        }
      }
      const circle = linkMap.get(props.point.leafletId);
      circle?.setStyle({ radius: 5, weight: 0 });
    }

    if (draggingRace()) {
      const associatedQuantity = getAssociatedQuantity(point);

      addPointToRace({ ...point, quantity: associatedQuantity });

      const waypoints = currentRace().waypoints;
      if (waypoints) {
        const newWaypoints = WaypointEntity.updateWaypoints(
          point,
          waypoints,
          currentRace().points
        );
        updateWaypoints(newWaypoints);
      }

      setDraggingRace(false);
    }
  };

  const color = () => {
    if (isInDrawRaceMode()) {
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
