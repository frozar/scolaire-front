import L from "leaflet";
import { onMount } from "solid-js";
import { BusLineType } from "../../../../../_entities/bus-line.entity";
import { OsrmService } from "../../../../../_services/osrm.service";

export type BusLineProps = {
  line: BusLineType;
  map: L.Map;
};

export function BusLine(props: BusLineProps) {
  const line = props.line;

  // TODO récupérer la Polyline

  // TODO attacher la polyline à une ligne leaflet

  // TODO ajouter les event

  onMount(async () => {
    const roadPolyline = await OsrmService.getRoadPolyline(line.points);
    console.log(roadPolyline);

    //TODO
  });

  return <></>;
}
