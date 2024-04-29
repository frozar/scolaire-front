import { createSignal, Show } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import {
  addNewGlobalSuccessInformation,
  addNewGlobalWarningInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { BusCategoryType } from "../organism/Bus";
import { BusEditMenu } from "./BusEditMenu";
import "./BusTableLine.css";
import { BusTableLineData } from "./BusTableLineData";

interface BusTableLineProps {
  busItem: BusCategoryType;
}

export function BusTableLine(props: BusTableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

  const [getCurrentBus, setCurrentBus] = createSignal<BusCategoryType>(
    // eslint-disable-next-line solid/reactivity
    props.busItem
  );

  function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  async function updateButton() {
    if (
      getCurrentBus().name == "" ||
      getCurrentBus().category == "" ||
      getCurrentBus().accessibility == ""
    ) {
      addNewGlobalWarningInformation("Veuillez entrer un nom");
      return;
    }
    enableSpinningWheel();
    await BusService.update(getCurrentBus());
    disableSpinningWheel();
    toggleEditMode();
    addNewGlobalSuccessInformation("Les modifications ont bien été apportées");
  }

  async function deleteButton() {
    enableSpinningWheel();
    await BusService.deleteBus(props.busItem.id);
    disableSpinningWheel();
    addNewGlobalSuccessInformation("Le bus a bien été supprimé");
  }

  function cancelButton() {
    setCurrentBus(props.busItem);
    toggleEditMode();
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <BusTableLineData
          busItem={getCurrentBus()}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteButton}
        />
      }
    >
      <td colspan={10}>
        <BusEditMenu
          busItem={getCurrentBus()}
          setBusItem={setCurrentBus}
          cancelFunction={cancelButton}
          submitFunction={updateButton}
        />
      </td>
    </Show>
  );
}
