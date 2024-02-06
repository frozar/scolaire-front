import L, { LeafletMouseEvent } from "leaflet";
import { For, Show, createEffect, createSignal } from "solid-js";

import { NatureEnum } from "../../../../../type";
import {
  changeBoard,
  onBoard,
} from "../../../board/component/template/ContextManager";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_EMPHASE,
  COLOR_STOP_FOCUS,
} from "../../constant";
import Line from "../atom/Line";
import PolylineDragMarker from "../atom/PolylineDragMarker";
import WaypointMarker from "../atom/WaypointMarker";
import { deselectAllTrips, setselectedTrip } from "../organism/Trips";

import { PathType } from "../../../../../_entities/path.entity";
import { TripPointType, TripType } from "../../../../../_entities/trip.entity";
import { WaypointType } from "../../../../../_entities/waypoint.entity";
import { updatePointColor } from "../../../../../leafletUtils";
import { PathUtil } from "../../../../../utils/path.utils";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
  displayTripMode,
  displayTripModeEnum,
  setCurrentTripIndex,
} from "../../../board/component/organism/DrawTripBoard";
import { setIsOverMapItem } from "../../l7MapBuilder";
import { getLines } from "../organism/BusLines";
import {
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
} from "../organism/Points";

export const [draggingTrip, setDraggingTrip] = createSignal<boolean>(false);

export function Trip(props: {
  trip?: TripType;
  path?: PathType;
  map: L.Map;
  lineColor?: string;
}) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);

  const points = () =>
    props.trip
      ? props.trip.tripPoints
      : props.path?.points.map((point) => PathUtil.getPathPoint(point));

  const latlngs = () => {
    if (props.trip) return props.trip.latLngs;
    if (props.path)
      return props.path.points
        .map((point) => PathUtil.getPathPoint(point))
        .map((point) => {
          return { lat: point.lat, lng: point.lon } as L.LatLng;
        });
    else return [];
  };

  createEffect(() => {
    if (
      displayTripMode() == displayTripModeEnum.onRoad ||
      onBoard() != "trip-draw"
    ) {
      setLocalLatLngs(latlngs());
      setLocalOpacity(0.7);
    } else {
      setLocalLatLngs(getLatLngsFromPoint(points() as TripPointType[]));
      setLocalOpacity(1);
    }
  });

  let pointFocus: { circle: L.CircleMarker; nature: NatureEnum }[] = [];
  createEffect(() => {
    // TODO passer en mode trip
    if (currentDrawTrip() === props.trip) {
      pointFocus.map((point) => {
        point.circle.setStyle({
          fillColor:
            point.nature === NatureEnum.school
              ? COLOR_SCHOOL_FOCUS
              : COLOR_STOP_FOCUS,
        });
      });
      pointFocus = [];
      props.trip.tripPoints.map((point) => {
        const circle = linkMap.get(point.leafletId);
        circle?.setStyle({ fillColor: COLOR_STOP_EMPHASE });
        pointFocus.push({
          circle: circle as L.CircleMarker,
          nature: point.nature,
        });
      });
    }
  });

  const color = () =>
    (props.trip ? props.trip.color : props.path?.color) as string;

  const onMouseOver = (polyline: L.Polyline, arrows: L.Marker[]) => {
    setIsOverMapItem(true);
    if (onBoard() != "trip-draw") {
      bustripSetBoldStyle(polyline, arrows, color());
    }
  };

  const onMouseOut = (polyline: L.Polyline, arrows: L.Marker[]) => {
    setIsOverMapItem(false);
    // if (!line.selected() && (isInRemoveTripMode() || isInReadMode())) {
    if (onBoard() != "trip-draw") {
      bustripSetNormalStyle(polyline, arrows, color());
    }
  };

  function onMouseDown(e: LeafletMouseEvent) {
    // if (displayTripMode() == displayTripModeEnum.straight && !isInReadMode()) {
    if (
      displayTripMode() == displayTripModeEnum.straight &&
      (currentStep() == DrawTripStep.editTrip ||
        currentStep() == DrawTripStep.buildReverse)
    ) {
      props.map.dragging.disable();

      function pointToTripDistance(
        clickCoordinate: L.LatLng,
        point1: L.LatLng,
        point2: L.LatLng
      ): number {
        const x1 = clickCoordinate.lng;
        const y1 = clickCoordinate.lat;
        const x2 = point1.lng;
        const y2 = point1.lat;
        const x3 = point2.lng;
        const y3 = point2.lat;

        return (
          Math.abs((y3 - y2) * x1 - (x3 - x2) * y1 + x3 * y2 - y3 * x2) /
          Math.sqrt(
            (point1.lat - point2.lat) ** 2 + (point1.lng - point2.lng) ** 2
          )
        );
      }
      const coordinates: L.LatLng[] = e.target._latlngs;

      let distance = pointToTripDistance(
        e.latlng,
        coordinates[0],
        coordinates[1]
      );
      let indice = 0;

      for (let i = 1; i < coordinates.length - 1; i++) {
        const actualDistance = pointToTripDistance(
          e.latlng,
          coordinates[i],
          coordinates[i + 1]
        );
        if (actualDistance < distance) {
          distance = actualDistance;
          indice = i;
        }
      }
      setLocalLatLngs((prev) => {
        prev.splice(indice + 1, 0, e.latlng);
        return [...prev];
      });
      setDraggingTrip(true);

      createEffect(() => {
        props.map?.on("mousemove", ({ latlng }) => {
          setLocalLatLngs((prev) => {
            prev.splice(indice + 1, 1, latlng);
            return [...prev];
          });
        });
      });

      setCurrentTripIndex(indice + 1);

      function handleMouseUp() {
        props.map?.off("mousemove");
        if (props.map.hasEventListeners("mousemove")) {
          props.map.off("mousemove");
        }

        props.map.dragging.enable();

        if (!cursorIsOverPoint()) {
          setLocalLatLngs((prev) => {
            prev.splice(indice + 1, 1);
            return [...prev];
          });
          setCurrentTripIndex(localLatLngs().length);
          setDraggingTrip(false);
        }
        document.removeEventListener("mouseup", handleMouseUp);
      }
      document.addEventListener("mouseup", handleMouseUp);
    }
  }

  const id = () => (props.trip ? props.trip.id : props?.path?.id) as number;
  const waypoints = () => props.trip?.waypoints ?? [];

  return (
    <>
      <Line
        latlngs={localLatLngs()}
        leafletMap={props.map}
        color={color()}
        opacity={localOpacity()}
        lineId={id()}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={() => onClickBusTrip(props.trip as TripType)}
        onMouseDown={onMouseDown}
      />
      <Show
        when={
          displayTripMode() == displayTripModeEnum.onRoad &&
          onBoard() == "trip-draw"
        }
      >
        <For each={latlngs()}>
          {(coord: L.LatLng) => {
            let index = 0;

            const pointProjectedCoord: L.LatLng[] = [];

            if (!waypoints()) {
              return <></>;
            }

            for (const waypoint of waypoints()) {
              if (waypoint.onRoadLat && waypoint.onRoadLon) {
                pointProjectedCoord.push(
                  L.latLng(waypoint.onRoadLat, waypoint.onRoadLon)
                );
              } else {
                pointProjectedCoord.push(L.latLng(waypoint.lat, waypoint.lon));
              }
            }

            for (let i = 0; latlngs().length - 1; i++) {
              if (
                pointProjectedCoord[index] &&
                pointProjectedCoord[index].lat == latlngs()[i].lat &&
                pointProjectedCoord[index].lng == latlngs()[i].lng
              ) {
                index += 1;
              }
              if (coord.equals(latlngs()[i])) {
                break;
              }
            }

            return pointProjectedCoord.filter((coordinates) =>
              coordinates.equals(coord)
            ).length > 0 ? (
              <></>
            ) : (
              <PolylineDragMarker
                map={props.map}
                latlngs={coord}
                index={index}
              />
            );
          }}
        </For>
        <Show when={currentDrawTrip().waypoints}>
          <For each={currentDrawTrip().waypoints}>
            {(waypoint: WaypointType, i) => {
              if (!waypoint.idSchool && !waypoint.idStop) {
                return (
                  <WaypointMarker
                    map={props.map}
                    latlngs={L.latLng(waypoint.lat, waypoint.lon)}
                    index={i()}
                  />
                );
              }
            }}
          </For>
        </Show>
      </Show>
    </>
  );
}

export function onClickBusTrip(trip: TripType) {
  switch (onBoard()) {
    case "line-details":
    case "trip-draw":
      return;

    default:
      deselectAllTrips();
      deselectAllPoints();

      // TODO: Factoriser
      getLines().forEach((line) => line.setSelected(false));
      getLines().forEach((line) => {
        if (line.trips.some((_trip) => _trip.id == trip.id)) {
          line.setSelected(true);
        }
      });

      setselectedTrip(trip);

      changeBoard("line-details");

      updatePointColor();
  }
}

function getLatLngsFromPoint(points: TripPointType[]): L.LatLng[] {
  return points.map((point) => L.latLng(point.lat, point.lon));
}

export function bustripSetNormalStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetNormalStyle(polyline, color);
  arrowsSetNormalStyle(arrowsLinked, color);
}

export function bustripSetBoldStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetBoldStyle(polyline, color);
  arrowsSetBoldStyle(arrowsLinked, color);
}

function polylineSetBoldStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 5 });
}

function polylineSetNormalStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 3 });
}

function arrowsSetBoldStyle(arrows: L.Marker[], color: string) {
  arrowApplyStyle(arrows, color, "scale(3,3) ");
}

function arrowsSetNormalStyle(arrows: L.Marker[], color: string) {
  arrowApplyStyle(arrows, color, "scale(2,2) ");
}

function arrowApplyStyle(arrows: L.Marker[], color: string, transform: string) {
  arrows.map((arrow) => {
    const element = arrow.getElement();
    if (!element) {
      return;
    }
    const elementChild = element.firstElementChild;
    if (!elementChild) {
      return;
    }
    elementChild.setAttribute("fill", color);
  });

  // Change size
  arrows.map((arrow) => {
    const element = arrow.getElement();
    if (!element) {
      return;
    }

    const elementChild = element.firstElementChild;
    if (!elementChild) {
      return;
    }

    const subChild = elementChild.firstElementChild;
    if (!subChild) {
      return;
    }

    // Keep first transformation value which should be a rotation
    const transformValue = subChild.getAttribute("transform");
    const rotation = transformValue;
    if (!rotation) {
      return;
    }

    const rotationValue = rotation.split(" ").at(1);
    const transformModifiedValue = transform + rotationValue;

    subChild.setAttribute("transform", transformModifiedValue);
  });
}
