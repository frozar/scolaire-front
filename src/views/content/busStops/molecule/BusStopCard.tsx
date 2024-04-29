import L from "leaflet";
import { Show } from "solid-js";
import { BusStopType } from "../../../../_entities/busStops.entity";
import CardWrapper from "../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import { leafletMap } from "../../_component/template/MapContainer";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./BusStopCard.css";

interface BusStopCardProps {
  busStop: BusStopType;
  showButtons?: boolean;
  deleteFunction?: (busStop: BusStopType) => void;
  editFunction?: (busStop: BusStopType) => void;
}

export function BusStopCard(props: BusStopCardProps) {
  function zoomBusStop() {
    const centerView = L.latLng(props.busStop.lat, props.busStop.lon);
    leafletMap()?.setView(centerView, 16);
  }

  function editBusStop() {
    if (props.editFunction) {
      props.editFunction(props.busStop);
    }
  }

  function deleteBusStop() {
    if (props.deleteFunction) {
      props.deleteFunction(props.busStop);
    }
  }

  return (
    <CardWrapper onClick={zoomBusStop}>
      <div class="bus-stop-card-title">
        <p>{props.busStop.name}</p>
        <Show when={props.showButtons}>
          <div class="bus-stop-card-buttons">
            <ButtonIcon icon={<UpdatePen />} onClick={editBusStop} />
            <ButtonIcon icon={<TrashIcon />} onClick={deleteBusStop} />
          </div>
        </Show>
      </div>
    </CardWrapper>
  );
}
