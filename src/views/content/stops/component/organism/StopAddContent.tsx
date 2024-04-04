import { Setter } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";
import { LabeledInputNumber } from "../../../board/component/molecule/LabeledInputNumber";

interface StopAddContentProps {
  stop: StopType;
  stopSetter: Setter<StopType>;
}

export function StopAddContent(props: StopAddContentProps) {
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
        <p>Latitude : {props.stop.lat ? props.stop.lat : 0}</p>
        <p>Longitude : {props.stop.lon ? props.stop.lon : 0}</p>
      </div>
    </div>
  );
}
