import { createSignal, Show } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { BusCategoryType } from "../organism/Bus";
import { BusEditMenu } from "./BusEditMenu";
import "./BusTableLine.css";
import { BusTableLineData } from "./BusTableLineData";

interface BusTableLineProps {
  busItem: BusCategoryType;
}

export function BusTableLine(props: BusTableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

  // eslint-disable-next-line solid/reactivity
  const [getName, setName] = createSignal(props.busItem.name);

  // eslint-disable-next-line solid/reactivity
  const [getCategory, setCategory] = createSignal(props.busItem.category);

  // eslint-disable-next-line solid/reactivity
  const [getCapacity, setCapacity] = createSignal(props.busItem.capacity);

  // eslint-disable-next-line solid/reactivity
  const [getAccess, setAccess] = createSignal(props.busItem.accessibility);

  async function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  async function updateButton() {
    enableSpinningWheel();
    await BusService.update({
      id: props.busItem.id,
      name: getName(),
      category: getCategory(),
      capacity: getCapacity(),
      accessibility: getAccess(),
    });
    disableSpinningWheel();
    toggleEditMode();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Les modifications ont bien été apportées",
    });
  }

  async function deleteButton() {
    enableSpinningWheel();
    await BusService.deleteBus(props.busItem.id);
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Le bus a bien été supprimé",
    });
  }

  function cancelButton() {
    setCategory(props.busItem.category);
    setCapacity(props.busItem.capacity);
    toggleEditMode();
  }

  function onCategoryInputChanged(value: string) {
    setCategory(value);
  }

  function onNameInputChanged(value: string) {
    setName(value);
  }

  function onCapacityInputChanged(value: number) {
    setCapacity(value);
  }

  function onAccessibilityInputChanged(value: string) {
    setAccess(value);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <BusTableLineData
          name={getName()}
          category={getCategory()}
          capacity={getCapacity()}
          access={getAccess()}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteButton}
        />
      }
    >
      <td colspan={7}>
        <BusEditMenu
          id={Number(props.busItem.id)}
          access={getAccess()}
          capacity={getCapacity()}
          category={getCategory()}
          name={getName()}
          cancelFunction={cancelButton}
          submitFunction={updateButton}
          onAccessibilityChange={onAccessibilityInputChanged}
          onCapacityChange={onCapacityInputChanged}
          onCategoryChange={onCategoryInputChanged}
          onNameChange={onNameInputChanged}
        />
      </td>
    </Show>
  );
}
