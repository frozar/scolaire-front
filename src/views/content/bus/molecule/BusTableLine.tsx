import { createSignal, Show } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import {
  addNewGlobalSuccessInformation,
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

export interface BusSizeType {
  length: number;
  width: number;
  height: number;
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
  const [getStand, setStand] = createSignal(props.busItem.capacity_standing);

  // eslint-disable-next-line solid/reactivity
  const [getPMR, setPMR] = createSignal(props.busItem.capacity_pmr);

  // eslint-disable-next-line solid/reactivity
  const [getAccess, setAccess] = createSignal(props.busItem.accessibility);

  // eslint-disable-next-line solid/reactivity
  const [getLength, setLength] = createSignal(props.busItem.length);

  // eslint-disable-next-line solid/reactivity
  const [getWidth, setWidth] = createSignal(props.busItem.width);

  // eslint-disable-next-line solid/reactivity
  const [getHeight, setHeight] = createSignal(props.busItem.height);

  const [getSize] = createSignal<BusSizeType>({
    height: props.busItem.height,
    width: props.busItem.width,
    length: props.busItem.length,
  });

  function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  async function updateButton() {
    if (getName() == "" || getCategory() == "" || getAccess() == "") return;
    enableSpinningWheel();
    await BusService.update({
      id: props.busItem.id,
      name: getName(),
      category: getCategory(),
      capacity: getCapacity(),
      capacity_standing: getStand(),
      capacity_pmr: getPMR(),
      accessibility: getAccess(),
      length: getLength(),
      width: getWidth(),
      height: getHeight(),
    });
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

  function onCapacityStandInputChanged(value: number) {
    setStand(value);
  }

  function onCapacityPMRInputChanged(value: number) {
    setPMR(value);
  }

  function onAccessibilityInputChanged(value: string) {
    setAccess(value);
  }

  function onLengthInputChanged(value: number) {
    setLength(value);
  }

  function onWidthInputChanged(value: number) {
    setWidth(value);
  }

  function onHeightInputChanged(value: number) {
    setHeight(value);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <BusTableLineData
          name={getName()}
          category={getCategory()}
          capacity={getCapacity()}
          capacityStand={getStand()}
          capacityPMR={getPMR()}
          access={getAccess()}
          size={getSize()}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteButton}
        />
      }
    >
      <td colspan={8}>
        <BusEditMenu
          id={Number(props.busItem.id)}
          access={getAccess()}
          capacity={getCapacity()}
          capacityStand={getStand()}
          capacityPMR={getPMR()}
          category={getCategory()}
          name={getName()}
          length={getLength()}
          width={getWidth()}
          height={getHeight()}
          cancelFunction={cancelButton}
          submitFunction={updateButton}
          onAccessibilityChange={onAccessibilityInputChanged}
          onCapacityChange={onCapacityInputChanged}
          onCapacityStandChange={onCapacityStandInputChanged}
          onCapacityPMRChange={onCapacityPMRInputChanged}
          onCategoryChange={onCategoryInputChanged}
          onNameChange={onNameInputChanged}
          onLengthChange={onLengthInputChanged}
          onWidthChange={onWidthInputChanged}
          onHeightChange={onHeightInputChanged}
        />
      </td>
    </Show>
  );
}
