import { createSignal, Show } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import CheckIcon from "../../../../icons/CheckIcon";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElementInput } from "../atom/TableElementInput";
import { TableElementNumberInput } from "../atom/TableElementNumberInput";
import { BusCategoryType } from "../organism/Bus";
import "./TableLine.css";
import { TableLineDisplayData } from "./TableLineDisplayData";

interface TableLineProps {
  busItem: BusCategoryType;
}

export function TableLine(props: TableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

  // eslint-disable-next-line solid/reactivity
  const [getName, setName] = createSignal(props.busItem.name);

  // eslint-disable-next-line solid/reactivity
  const [getCategory, setCategory] = createSignal(props.busItem.category);

  // eslint-disable-next-line solid/reactivity
  const [getCapacity, setCapacity] = createSignal(props.busItem.capacity);

  async function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  async function updateButton() {
    await BusService.update({
      id: props.busItem.id,
      name: getName(),
      category: getCategory(),
      capacity: getCapacity(),
    });
    toggleEditMode();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Les modifications ont bien été apportées",
    });
  }

  async function deleteButton() {
    await BusService.deleteBus(props.busItem.id);
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

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <TableLineDisplayData
          name={getName()}
          category={getCategory()}
          capacity={getCapacity()}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteButton}
        />
      }
    >
      <TableRow active={true}>
        <TableElementInput
          defaultValue={getName()}
          onInputFunction={onNameInputChanged}
          placeholder="Entrer le nom du bus"
        />
        <TableElementInput
          defaultValue={getCategory()}
          onInputFunction={onCategoryInputChanged}
          placeholder="Entrer le type de bus"
        />
        <TableElementNumberInput
          defaultValue={getCapacity()}
          onChangeFunction={setCapacity}
        />
        <TableData text="-" />
        <TableData text="-" />
        <TableDataChilds end={true}>
          <ButtonIcon icon={<CheckIcon />} onClick={updateButton} />
          <ButtonIcon icon={<CircleCrossIcon />} onClick={cancelButton} />
        </TableDataChilds>
      </TableRow>
    </Show>
  );
}
