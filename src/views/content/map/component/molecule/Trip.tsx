import L, { LeafletMouseEvent } from "leaflet";
import { For, Show, createEffect, createSignal } from "solid-js";

import { NatureEnum } from "../../../../../type";
import { onBoard } from "../../../board/component/template/ContextManager";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_EMPHASE,
  COLOR_STOP_FOCUS,
} from "../../constant";
import Line from "../atom/Line";
import PolylineDragMarker from "../atom/PolylineDragMarker";
import WaypointMarker from "../atom/WaypointMarker";

import { PathType } from "../../../../../_entities/path.entity";
import { TripPointType, TripType } from "../../../../../_entities/trip.entity";
import { WaypointType } from "../../../../../_entities/waypoint.entity";
import { PathUtil } from "../../../../../utils/path.utils";
import {
  DrawTripStep,
  currentDrawTrip,
  currentStep,
  displayTripMode,
  displayTripModeEnum,
  setCurrentTripIndex,
} from "../../../board/component/organism/DrawTripBoard";
import {
  DrawPathStep,
  onDrawPathStep,
} from "../../../path/component/drawPath.utils";
import { setIsOverMapItem } from "../../l7MapBuilder";
import { cursorIsOverPoint, linkMap } from "../organism/Points";
import { TripMapUtils } from "./tripMap.utils";

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
      setLocalLatLngs(
        TripMapUtils.getLatLngsFromPoint(points() as TripPointType[])
      );
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
      TripMapUtils.bustripSetBoldStyle(polyline, arrows, color());
    }
  };

  const onMouseOut = (polyline: L.Polyline, arrows: L.Marker[]) => {
    setIsOverMapItem(false);
    if (onBoard() != "trip-draw") {
      TripMapUtils.bustripSetNormalStyle(polyline, arrows, color());
    }
  };

  function onMouseDown(e: LeafletMouseEvent) {
    const tripStepCondition =
      currentStep() == DrawTripStep.editTrip ||
      currentStep() == DrawTripStep.buildReverse;

    const pathStepCondition = onDrawPathStep() == DrawPathStep.editPath;
    if (
      displayTripMode() == displayTripModeEnum.straight &&
      (tripStepCondition || pathStepCondition)
    ) {
      props.map.dragging.disable();

      const indice = TripMapUtils.getIndexBetween2PointGrabbed(e);

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

      // ! Keep it here !!
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

  function onClickLine() {
    if (props.trip) TripMapUtils.onClickBusTrip(props.trip);
    if (props.path) TripMapUtils.onClickPath(props.path);
  }

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
        onClick={onClickLine}
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
