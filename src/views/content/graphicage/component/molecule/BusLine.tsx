import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { OsrmService } from "../../../../../_services/osrm.service";
import { setRemoveConfirmation } from "../../../../../signaux";
import { deselectAllBusLines, setPickerColor } from "../../line/BusLines";
import {
  buslineSetBoldStyle,
  buslineSetNormalStyle,
} from "../../line/busLinesUtils";
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
      buslineSetNormalStyle(polyline, arrows, line.color);
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
      setPickerColor(line.color);
      line.setSelected(true);
    }
  };

  return (
    <Line
      latlngs={localLatLngs()}
      leafletMap={props.map}
      color={props.line.color + ""}
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
