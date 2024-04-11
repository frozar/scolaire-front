import { Setter, createSignal } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import Button from "../../../../../component/atom/Button";
import { setDisplayBusStops } from "../../../_component/organisme/BusStopPoints";
import { setDisplayStops } from "../../../_component/organisme/StopPoints";
import { setMapOnClick } from "../../../_component/template/MapContainer";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { LabeledInputNumber } from "../../../board/component/molecule/LabeledInputNumber";

interface StopAddContentProps {
  stop: StopType;
  stopSetter: Setter<StopType>;
}

export function StopAddContent(props: StopAddContentProps) {
  const [isChoosingLocal, setIsChoosingLocal] = createSignal(false);

  function onInputName(value: string) {
    props.stopSetter((prev) => {
      return { ...prev, name: value };
    });
  }

  function onInputWaitingTime(value: number) {
    props.stopSetter((prev) => {
      return { ...prev, waitingTime: value };
    });
  }

  function toggleChoosingLocal() {
    if (isChoosingLocal()) return;
    setIsChoosingLocal(true);
    setMapOnClick(() => setLocation);
    setDisplayBusStops([]);
  }

  function setLocation(e: L.LeafletMouseEvent) {
    if (!isChoosingLocal()) return;
    props.stopSetter((prev) => {
      return { ...prev, lat: e.latlng.lat, lon: e.latlng.lng } as StopType;
    });
    setDisplayStops([props.stop]);
    setIsChoosingLocal(false);
    setMapOnClick(undefined);
  }

  return (
    <div>
      <LabeledInputField
        label="Nom"
        name="name"
        value={props.stop.name ? props.stop.name : ""}
        onInput={(e) => onInputName(e.target.value)}
      />
      <LabeledInputNumber
        label="Temps d'attente"
        name="waitTime"
        onInput={(e) => onInputWaitingTime(Number(e.target.value))}
        value={props.stop.waitingTime ? props.stop.waitingTime : 0}
      />
      <div>
        <div class="text-xl">Coordonnées</div>
        <Button
          label="Modifier l'emplacement"
          onClick={toggleChoosingLocal}
          isDisabled={isChoosingLocal()}
        />
        <p>Latitude : {props.stop.lat ? props.stop.lat : 0}</p>
        <p>Longitude : {props.stop.lon ? props.stop.lon : 0}</p>
      </div>
    </div>
  );
}
