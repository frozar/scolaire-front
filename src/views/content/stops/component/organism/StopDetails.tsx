import { Show, createSignal, onMount } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { LabeledInputNumber } from "../../../../../component/molecule/LabeledInputNumber";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { StopUtils } from "../../../../../utils/stop.utils";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { RemainingStudentInformation } from "../atom/RemainingStudentInformation";
import { StopActionsPanelsButtons } from "../molecul/StopActionsPanelsButtons";
import { StopDetailsHeader } from "../molecul/StopDetailsHeader";
import { StopFooter } from "../molecul/StopFooter";
import { StopContentPanels } from "./StopContentPanels";
import "./StopDetails.css";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export enum StopPanels {
  grades = "grades",
  trips = "trips",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.grades);
  const [editItem, setEditItem] = createSignal<boolean>(false);
  const [addQuantity, setAddQuantity] = createSignal<boolean>(false);

  onMount(() => {
    if (!stopDetailsItem()) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  function toggleEditItem() {
    setEditItem((bool) => !bool);
  }
  const toggleInAddQuantity = () => setAddQuantity((prev) => !prev);

  function onChangeWaitingTime(element: HTMLInputElement) {
    StopUtils.updateStopDetailsItem({ waitingTime: Number(element.value) });
  }

  return (
    <section>
      <StopDetailsHeader
        stop={stopDetailsItem() as StopType}
        editing={editItem}
        toggleEditing={toggleEditItem}
      />

      <LabeledInputNumber
        onChange={onChangeWaitingTime}
        selector={{
          disabled: !editItem(),
          value: stopDetailsItem()?.waitingTime as number,
        }}
        label="Temps d'attente en seconde sur l'arrêt"
      />

      <Show when={!editItem()}>
        <RemainingStudentInformation />

        <StopActionsPanelsButtons
          onPanel={onPanel}
          setOnPanel={setOnPanel}
          toggleInAddQuantity={toggleInAddQuantity}
        />

        <StopContentPanels
          onPanel={onPanel}
          setOnPanel={setOnPanel}
          inAddQuantity={addQuantity}
          toggleInAddQuantity={toggleInAddQuantity}
        />
      </Show>

      <StopFooter editItem={editItem()} toggleEdit={toggleEditItem} />
    </section>
  );
}
