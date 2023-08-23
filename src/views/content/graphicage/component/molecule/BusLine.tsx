import L, { LeafletMouseEvent } from "leaflet";
import { Show, createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { setRemoveConfirmation } from "../../../../../signaux";
import { NatureEnum } from "../../../../../type";
import {
  COLOR_POINT_EMPHASE,
  COLOR_SCHOOL_POINT,
  COLOR_STOP_POINT,
} from "../../constant";
import { setPickerColor } from "../atom/ColorPicker";
import Line from "../atom/Line";
import {
  currentStep,
  drawModeStep,
} from "../organism/AddLineInformationBoardContent";
import { deselectAllBusLines } from "../organism/BusLines";
import { deselectAllPoints, linkMap } from "../organism/Points";
import LineTip from "./LineTip";

const [
  ,
  {
    isInReadMode,
    isInRemoveLineMode,
    getLineUnderConstruction,
    setLineUnderConstructionNextIndex,
  },
] = useStateAction();

export const [showLineTip, setShowLineTip] = createSignal<boolean>(false);
const [lineTipCoordinates, setLineTipCoordinates] = createSignal<L.LatLng[]>(
  []
);

export type BusLineProps = {
  line: BusLineType;
  map: L.Map;
};

export function BusLine(props: BusLineProps) {
  const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
  const [localOpacity, setLocalOpacity] = createSignal<number>(1);
  // eslint-disable-next-line solid/reactivity
  createEffect(async () => {
    // TODO Put to BusLineEntity
    // const latlngs: L.LatLng[] = await OsrmService.getRoadPolyline(line.points);
    // line.setLatLngs(latlngs);

    if (
      currentStep() != drawModeStep.stopSelection &&
      props.line.latLngs().length != 0
    ) {
      setLocalLatLngs(props.line.latLngs());
      setLocalOpacity(0.8);
    } else {
      setLocalLatLngs(getLatLngsFromPoint(props.line.points));
      setLocalOpacity(1);
    }
  });

  createEffect(() => {
    if (
      props.line.selected() ||
      getLineUnderConstruction().busLine === props.line
    ) {
      props.line.points.map((point) => {
        const circle = linkMap.get(point.leafletId);
        circle?.setStyle({ color: COLOR_POINT_EMPHASE });
      });
    } else {
      props.line.points.map((point) => {
        const circle = linkMap.get(point.leafletId);
        const color =
          point.nature === NatureEnum.school
            ? COLOR_SCHOOL_POINT
            : COLOR_STOP_POINT;
        circle?.setStyle({ color: color });
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
      //TODO fonction à explorer
      setRemoveConfirmation({
        displayed: true,
        idBusLine: props.line.id ?? null,
      });
    }

    if (isInReadMode()) {
      deselectAllBusLines();
      deselectAllPoints();
      setPickerColor(props.line.color());
      props.line.setSelected(true);
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
        const x1 = point1.lng;
        const y1 = point1.lat;
        const x2 = point2.lng;
        const y2 = point2.lat;
        const x = clickCoordinate.lng;
        const y = clickCoordinate.lat;

        return (
          Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1) /
          Math.sqrt(
            (point1.lat - point2.lat) ** 2 + (point1.lng - point2.lng) ** 2
          )
        );
      }
      const coordinates: L.LatLng[] = e.target._latlngs;

      let distance = 999;
      let indice = -1;
      for (let i = 0; i < coordinates.length - 1; i++) {
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
      setLineTipCoordinates([coordinates[indice], coordinates[indice + 1]]);
      setShowLineTip(true);

      setLineUnderConstructionNextIndex(indice + 1);

      function handleMouseUp() {
        setShowLineTip(false);
        props.map.dragging.enable();
        document.removeEventListener("mouseup", handleMouseUp);
      }
      document.addEventListener("mouseup", handleMouseUp);
    }
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
      <Show when={showLineTip()}>
        <LineTip
          leafletMap={props.map}
          color="red"
          latlng={[lineTipCoordinates()[0], lineTipCoordinates()[1]]}
          opacity={1}
        />
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
