import L, { LeafletMouseEvent } from "leaflet";
import { For, Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import {
  setSchoolPointsColor,
  setStopPointsColor,
} from "../../../../../leafletUtils";
import { NatureEnum } from "../../../../../type";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_SCHOOL_LIGHT,
  COLOR_STOP_EMPHASE,
  COLOR_STOP_FOCUS,
  COLOR_STOP_LIGHT,
} from "../../constant";
import { setPickerColor } from "../atom/ColorPicker";
import Line from "../atom/Line";
// import {
//   currentStep,
//   drawModeStep,
// } from "../organism/AddLineInformationBoardContent";
import PolylineDragMarker from "../atom/PolylineDragMarker";
import { deselectAllBusLines } from "../organism/BusLines";
import { currentStep, drawModeStep } from "../organism/DrawModeBoardContent";
import {
  cursorIsOverPoint,
  deselectAllPoints,
  linkMap,
} from "../organism/Points";

const [
  ,
  {
    isInReadMode,
    isInRemoveLineMode,
    getLineUnderConstruction,
    setLineUnderConstructionNextIndex,
    isInAddLineMode,
  },
] = useStateAction();

export const [draggingLine, setDraggingLine] = createSignal<boolean>(false);

export type BusLineProps = {
  line: BusLineType;
  map: L.Map;
};

export function BusLine(props: BusLineProps) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    if (
      currentStep() != drawModeStep.stopSelection &&
      props.line.latLngs().length != 0
    ) {
      // ! ici tracé de polyline
      setLocalLatLngs(props.line.latLngs());
      setLocalOpacity(0.8);
    } else {
      setLocalLatLngs(getLatLngsFromPoint(props.line.points));
      setLocalOpacity(1);
    }
  });

  createEffect(() => {
    if (getLineUnderConstruction().busLine === props.line) {
      props.line.points.map((point) => {
        const circle = linkMap.get(point.leafletId);
        circle?.setStyle({ fillColor: COLOR_STOP_EMPHASE });
      });
    } else {
      props.line.points.map((point) => {
        const circle = linkMap.get(point.leafletId);
        const color =
          point.nature === NatureEnum.school
            ? COLOR_SCHOOL_FOCUS
            : COLOR_STOP_FOCUS;
        circle?.setStyle({ fillColor: color });
      });
    }
  });

  const onMouseOver = (polyline: L.Polyline, arrows: L.Marker[]) => {
    // if (!line.selected() && (isInRemoveLineMode() || isInReadMode())) {
    if (isInRemoveLineMode() || isInReadMode()) {
      buslineSetBoldStyle(polyline, arrows, "white");
    }
  };

  const onMouseOut = (polyline: L.Polyline, arrows: L.Marker[]) => {
    // if (!line.selected() && (isInRemoveLineMode() || isInReadMode())) {
    if (isInRemoveLineMode() || isInReadMode()) {
      buslineSetNormalStyle(polyline, arrows, props.line.color());
    }
  };

  const onClick = () => {
    if (isInRemoveLineMode()) {
      //TODO fonction à explorer --- To Fix
      // setRemoveConfirmation({
      //   displayed: true,
      //   idBusLine: line.id,
      // });
    }

    if (isInReadMode()) {
      deselectAllBusLines();
      deselectAllPoints();
      setPickerColor(props.line.color());
      props.line.setSelected(true);

      const leafletIds = props.line.points.map((point) => point.leafletId);
      setStopPointsColor(leafletIds, COLOR_STOP_LIGHT);
      setSchoolPointsColor(leafletIds, COLOR_SCHOOL_LIGHT);
    }
  };

  function onMouseDown(e: LeafletMouseEvent) {
    if (currentStep() == drawModeStep.stopSelection) {
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
  const latLngList = props.line.latLngs();
  const pointProjectedCoord: L.LatLng[] = [];
  for (const point of props.line.points) {
    pointProjectedCoord.push(L.latLng(point.lat, point.lon));
  }
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
        onClick={onClick}
        onMouseDown={onMouseDown}
      />
      <Show when={currentStep() == drawModeStep.polylineEdition}>
        {/* // ! Passer le bon props (indexPointBefore) */}
        <For each={latLngList}>
          {(coord: L.LatLng) => {
            console.log("coord", coord);
            // ! Boucler sur chaque latlgns
            // ! si correspond à un point => indexPointBefore + 1
            // ! si correspond à coord => break
            // const indexPointBefore = 0;
            // for (let i = 0; latLngList.length - 1; i++) {
            //   if (latLngList[i] coord) {
            //     indexPointBefore + 1;
            //   }
            // }

            return (
              <PolylineDragMarker
                map={props.map}
                latlngs={coord}
                indexPointBefore={0} // ! use correct value => indexPointBefore
              />
            );
          }}
        </For>
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
