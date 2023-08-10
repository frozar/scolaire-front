import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { OsrmService } from "../../../../../_services/osrm.service";
import { setRemoveConfirmation } from "../../../../../signaux";
import { deselectAllBusLines } from "../../line/BusLines";
import { setPickerColor } from "../atom/ColorPicker";
import Line from "../atom/Line";
import { deselectAllPoints } from "../organism/Points";

const [, { isInReadMode, isInRemoveLineMode }] = useStateAction();

export type BusLineProps = {
  line: BusLineType;
  map: L.Map;
};

const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
const [localOpacity, setLocalOpacity] = createSignal<number>(1);

export function BusLine(props: BusLineProps) {
  const line = props.line;

  createEffect(async () => {
    // TODO les polyline devront être stocké en BDD pour garder persistence des données. Le service sera utilisé si aucune polyline pré-existance ou à la création/modification d'une ligne
    const latlngs: L.LatLng[] = await OsrmService.getRoadPolyline(line.points);
    line.setLatLngs(latlngs);

    // TODO Have to create signal roadPolylineMode the ReadMode and DrawMode will maage roadPolylineMode signal
    if (isInReadMode() && line.latLngs().length != 0) {
      setLocalLatLngs(line.latLngs());
      setLocalOpacity(0.8);
    } else {
      setLocalLatLngs(getLatLngsFromPoint(line.points));
      setLocalOpacity(1);
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
      buslineSetNormalStyle(polyline, arrows, line.color());
    }
  };

  const onClick = () => {
    if (isInRemoveLineMode()) {
      //TODO fonction à explorer
      setRemoveConfirmation({
        displayed: true,
        idBusLine: line.id,
      });
    }

    if (isInReadMode()) {
      deselectAllBusLines();
      deselectAllPoints();
      setPickerColor(line.color());
      line.setSelected(true);
    }
  };

  return (
    <Line
      latlngs={localLatLngs()}
      leafletMap={props.map}
      color={props.line.color()}
      opacity={localOpacity()}
      withArrows={true}
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
  // Change color
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
