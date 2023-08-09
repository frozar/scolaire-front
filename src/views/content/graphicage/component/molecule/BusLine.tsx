import L from "leaflet";
import { createEffect, createSignal } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import {
  BusLinePointType,
  BusLineType,
} from "../../../../../_entities/bus-line.entity";
import { OsrmService } from "../../../../../_services/osrm.service";
import Line from "../atom/Line";

const [, { isInReadMode }] = useStateAction();

export type BusLineProps = {
  line: BusLineType;
  map: L.Map;
};

const [localLatLngs, setLocalLatLngs] = createSignal<L.LatLng[]>([]);
const [localOpacity, setLocalOpascity] = createSignal<number>(1);

export function BusLine(props: BusLineProps) {
  const line = props.line;

  // TODO add arrows
  // TODO ajouter les event

  createEffect(async () => {
    // TODO les polyline devront être stocké en BDD pour garder persistence des données. Le service sera utilisé si aucune polyline pré-existance ou à la création/modification d'une ligne
    const latlngs: L.LatLng[] = await OsrmService.getRoadPolyline(line.points);
    line.setPolyline(latlngs);

    // TODO Have to create signal roadPolylineMode the ReadMode and DrawMode will maage roadPolylineMode signal
    if (isInReadMode() && line.polyline().length != 0) {
      setLocalLatLngs(line.polyline());
      setLocalOpascity(0.8);
    } else {
      setLocalLatLngs(getLatLngsFromPoint(line.points));
      setLocalOpascity(1);
    }

    //TODO
  });

  return (
    <Line
      latlngs={localLatLngs()}
      leafletMap={props.map}
      color={props.line.color + ""}
      opacity={localOpacity()}
      withArrows={true}
    />
  );
}

function getLatLngsFromPoint(points: BusLinePointType[]): L.LatLng[] {
  return points.map((point) => L.latLng(point.lat, point.lon));
}
