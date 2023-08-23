import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { setRemoveConfirmation } from "../../../../../signaux";
import { NatureEnum } from "../../../../../type";
import {
  COLOR_SCHOOL_POINT,
  COLOR_STOP_POINT,
  STOP_READ_EMPHASE,
} from "../../constant";
import { setPickerColor } from "../atom/ColorPicker";
import Line from "../atom/Line";
import {
  currentStep,
  drawModeStep,
} from "../organism/AddLineInformationBoardContent";
import { deselectAllBusLines } from "../organism/BusLines";
import { deselectAllPoints, linkMap } from "../organism/Points";

const [, { isInReadMode, isInRemoveLineMode, getLineUnderConstruction }] =
  useStateAction();

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
        circle?.setStyle({ color: STOP_READ_EMPHASE });
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
    }
  };

  return (
    <Line
      latlngs={localLatLngs()}
      leafletMap={props.map}
      color={props.line.color()}
      opacity={localOpacity()}
      lineId={props.line.id}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    />
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
