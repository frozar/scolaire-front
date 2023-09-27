import L, { LeafletMouseEvent } from "leaflet";
import { For, Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
  WaypointType,
} from "../../../../../_entities/bus-line.entity";

import { NatureEnum } from "../../../../../type";
import { setPickerColor } from "../../../board/component/atom/ColorPicker";
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
import { deselectAllBusLines } from "../organism/BusLines";

import { updatePointColor } from "../../../../../leafletUtils";
import {
  currentStep,
  displayLineMode,
  displayLineModeEnum,
  drawModeStep,
} from "../../../board/component/organism/DrawModeBoardContent";
import { setIsOverMapItem } from "../../l7MapBuilder";
import {
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
} from "../organism/Points";

const [, { getLineUnderConstruction, setLineUnderConstructionNextIndex }] =
  useStateAction();

export const [draggingLine, setDraggingLine] = createSignal<boolean>(false);

export type BusLineProps = {
  line: BusLineType;
  map: L.Map;
};

export function onClickBusLine(line: BusLineType) {
  if (onBoard() != "line-draw") {
    deselectAllBusLines();
    deselectAllPoints();
    setPickerColor(line.color());
    line.setSelected(true);

    changeBoard("line-details");

    updatePointColor();
  }
}

export function BusLine(props: BusLineProps) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);
  createEffect(() => {
    if (
      displayLineMode() == displayLineModeEnum.onRoad ||
      onBoard() != "line-draw"
    ) {
      setLocalLatLngs(props.line.latLngs());
      setLocalOpacity(0.8);
    } else {
      setLocalLatLngs(getLatLngsFromPoint(props.line.points));
      setLocalOpacity(1);
    }
  });

  let pointFocus: { circle: L.CircleMarker; nature: NatureEnum }[] = [];
  createEffect(() => {
    if (getLineUnderConstruction().busLine === props.line) {
      pointFocus.map((point) => {
        point.circle.setStyle({
          fillColor:
            point.nature === NatureEnum.school
              ? COLOR_SCHOOL_FOCUS
              : COLOR_STOP_FOCUS,
        });
      });
      pointFocus = [];
      props.line.points.map((point) => {
        const circle = linkMap.get(point.leafletId);
        circle?.setStyle({ fillColor: COLOR_STOP_EMPHASE });
        pointFocus.push({
          circle: circle as L.CircleMarker,
          nature: point.nature,
        });
      });
    }
  });

  const onMouseOver = (polyline: L.Polyline, arrows: L.Marker[]) => {
    setIsOverMapItem(true);
    if (onBoard() != "line-draw") {
      buslineSetBoldStyle(polyline, arrows, "white");
    }
  };

  const onMouseOut = (polyline: L.Polyline, arrows: L.Marker[]) => {
    setIsOverMapItem(false);
    // if (!line.selected() && (isInRemoveLineMode() || isInReadMode())) {
    if (onBoard() != "line-draw") {
      buslineSetNormalStyle(polyline, arrows, props.line.color());
    }
  };

  function onMouseDown(e: LeafletMouseEvent) {
    // if (displayLineMode() == displayLineModeEnum.straight && !isInReadMode()) {
    if (
      displayLineMode() == displayLineModeEnum.straight &&
      currentStep() == drawModeStep.editLine
    ) {
      props.map.dragging.disable();

      function pointToLineDistance(
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

      let distance = pointToLineDistance(
        e.latlng,
        coordinates[0],
        coordinates[1]
      );
      let indice = 0;

      for (let i = 1; i < coordinates.length - 1; i++) {
        const actualDistance = pointToLineDistance(
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
      setDraggingLine(true);

      createEffect(() => {
        props.map?.on("mousemove", ({ latlng }) => {
          setLocalLatLngs((prev) => {
            prev.splice(indice + 1, 1, latlng);
            return [...prev];
          });
        });
      });

      setLineUnderConstructionNextIndex(indice + 1);

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
          setLineUnderConstructionNextIndex(localLatLngs().length);
          setDraggingLine(false);
        }
        document.removeEventListener("mouseup", handleMouseUp);
      }
      document.addEventListener("mouseup", handleMouseUp);
    }
  }

  const latLngList = () => props.line.latLngs();

  return (
    <>
      <Line
        latlngs={localLatLngs()}
        leafletMap={props.map}
        color={props.line.color()}
        opacity={localOpacity()}
        lineId={props.line.id}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        onClick={() => onClickBusLine(props.line)}
        onMouseDown={onMouseDown}
      />
      <Show
        when={
          displayLineMode() == displayLineModeEnum.onRoad &&
          onBoard() == "line-draw"
        }
      >
        <For each={latLngList()}>
          {(coord: L.LatLng) => {
            let index = 0;

            const pointProjectedCoord: L.LatLng[] = [];

            const waypoints = props.line.waypoints;
            if (!waypoints) {
              return <></>;
            }

            for (const waypoint of waypoints) {
              if (waypoint.onRoadLat && waypoint.onRoadLon) {
                pointProjectedCoord.push(
                  L.latLng(waypoint.onRoadLat, waypoint.onRoadLon)
                );
              } else {
                pointProjectedCoord.push(L.latLng(waypoint.lat, waypoint.lon));
              }
            }

            for (let i = 0; latLngList().length - 1; i++) {
              if (
                pointProjectedCoord[index].lat == latLngList()[i].lat &&
                pointProjectedCoord[index].lng == latLngList()[i].lng
              ) {
                index += 1;
              }
              if (coord.equals(latLngList()[i])) {
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
        <Show when={getLineUnderConstruction().busLine.waypoints}>
          <For each={getLineUnderConstruction().busLine.waypoints}>
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

function getLatLngsFromPoint(points: BusLinePointType[]): L.LatLng[] {
  return points.map((point) => L.latLng(point.lat, point.lon));
}

export function buslineSetNormalStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetNormalStyle(polyline, color);
  arrowsSetNormalStyle(arrowsLinked, color);
}

export function buslineSetBoldStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetBoldStyle(polyline, color);
  arrowsSetBoldStyle(arrowsLinked, color);
}

function polylineSetBoldStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 8 });
}

function polylineSetNormalStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 3 });
}

function arrowsSetBoldStyle(arrows: L.Marker[], color: string) {
  arrowApplyStyle(arrows, color, "scale(4,4) ");
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
