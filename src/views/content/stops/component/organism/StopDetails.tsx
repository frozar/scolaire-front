import { Show, createSignal, onMount } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { StopUtils } from "../../../../../utils/stop.utils";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getStops } from "../../../map/component/organism/StopPoints";
import { RemainingStudentInformation } from "../atom/RemainingStudentInformation";
import { StopActionsPanelsButtons } from "../molecul/StopActionsPanelsButtons";
import { StopDetailsHeader } from "../molecul/StopDetailsHeader";
import { WaitingTimeInput } from "../molecul/WaitingTimeInput";
import { StopContentPanels } from "./StopContentPanels";
import "./StopDetails.css";

export const [stopDetailsItem, setStopDetailsItem] = createSignal<StopType>();

export function updateStopDetailsItem(stopId: number) {
  if (stopDetailsItem() != undefined && stopDetailsItem()?.id == stopId) {
    const stopIndex = getStops().findIndex((prev) => prev.id == stopId);
    const stop = getStops()[stopIndex];

    setStopDetailsItem((prev) => {
      if (prev != undefined) {
        const currentItem = { ...stop };
        return currentItem;
      }
      return prev;
    });
  }
}
export enum StopPanels {
  grades = "grades",
  trips = "trips",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<StopPanels>(StopPanels.grades);
  const [editItem, setEditItem] = createSignal<boolean>(false);
  const [addQuantity, setAddQuantity] = createSignal<boolean>(false);

  onMount(() => {
    if (stopDetailsItem() == undefined) {
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

      <WaitingTimeInput
        onChange={onChangeWaitingTime}
        selector={{
          disabled: !editItem(),
          value: stopDetailsItem()?.waitingTime as number,
        }}
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
          toggleEditItem={toggleEditItem}
        />
      </Show>
      <Show when={editItem()}>
        <BoardFooterActions
          previousStep={{
            callback: () => toggleEditItem(),
            label: "annuler",
          }}
          nextStep={{
            callback: async () => {
              const response = await StopUtils.update(
                stopDetailsItem() as StopType
              );
              if (response) toggleEditItem();
            },
            label: "enregistrer",
          }}
        />
      </Show>
    </section>
  );
}
