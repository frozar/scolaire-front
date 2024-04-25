import L from "leaflet";
import { BusStopType } from "../../../../_entities/busStops.entity";
import CardWrapper from "../../../../component/molecule/CardWrapper";
import { leafletMap } from "../../_component/template/MapContainer";

interface BusStopCardProps {
  busStop: BusStopType;
}

export function BusStopCard(props: BusStopCardProps) {
  function zoomBusStop() {
    const centerView = L.latLng(props.busStop.lat, props.busStop.lon - 0.025);
    leafletMap()?.setView(centerView);
  }

  return (
    <CardWrapper onClick={zoomBusStop}>
      <p>{props.busStop.name}</p>
    </CardWrapper>
  );
}
