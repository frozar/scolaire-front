import { createSignal, onMount } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getStops } from "../../../map/component/organism/StopPoints";
import { RemainingStudentInformation } from "../atom/RemainingStudentInformation";
import { StopActionsPanelsButtons } from "../molecul/StopActionsPanelsButtons";
import StopDetailsHeader from "../molecul/StopDetailsHeader";
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

  onMount(() => {
    if (stopDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  const toggleEditItem = () => setEditItem((bool) => !bool);

  return (
    <section>
      <StopDetailsHeader stop={stopDetailsItem() as StopType} />
      <RemainingStudentInformation />
      <StopActionsPanelsButtons
        onPanel={onPanel}
        setOnPanel={setOnPanel}
        toggleEditItem={toggleEditItem}
      />
      <StopContentPanels
        onPanel={onPanel}
        setOnPanel={setOnPanel}
        editItem={editItem}
        toggleEditItem={toggleEditItem}
      />
    </section>
  );
}
