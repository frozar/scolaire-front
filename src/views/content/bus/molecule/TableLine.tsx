import { createSignal, Show } from "solid-js";
import { BusCategoryType } from "../../../../_entities/bus.entity";
import { BusService } from "../../../../_services/bus.service";
import { TextInput } from "../../../../component/atom/TextInput";
import CheckIcon from "../../../../icons/CheckIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import InputNumber from "../../stops/component/atom/InputNumber";
import { TableElement } from "../atom/TableElement";
import "./TableLine.css";

interface TableLineProps {
  busItem: BusCategoryType;
  isEditMode: boolean;
}

export function TableLine(props: TableLineProps) {

  const bufferBus: BusCategoryType = props.busItem;

  const [getEditMode, setEditMode] = createSignal(props.isEditMode);  
  
  const [getCapacity, setCapacity] = createSignal({
    value: bufferBus.capacity,
    disabled: false,
  });
  
  async function toggleEditMode() {
    if (!props.isEditMode && getEditMode()) {
      await BusService.update(bufferBus);
    }

    if (props.isEditMode) {
      await BusService.create(bufferBus);
    }

    setEditMode(!getEditMode());
  }

  async function deleteButton() {
    await BusService.deleteBus(bufferBus.id);
  }

  function onCategoryInputChanged(value: string) {
    bufferBus.category = value;
  };

  function onCapacityInputChanged(element: HTMLInputElement) {
    bufferBus.capacity = Number(element.value);
  };

  return (
    <Show
      when={getEditMode()}
      fallback={
        <tr class="tableRow">
          <TableElement text={props.busItem.category} />
          <TableElement text={props.busItem.capacity.toString()} />
          <TableElement text="-" />
          <TableElement text="-" />
          <td class="actionButtonContainer">
            <ButtonIcon icon={<UpdatePen />} onClick={toggleEditMode} />
            <ButtonIcon icon={<TrashIcon />} onClick={deleteButton} />
          </td>
        </tr>
      }
    >
      <tr class="tableRowEditing">
        <td class="tableEdit">
          <TextInput
            onInput={onCategoryInputChanged}
            defaultValue={props.busItem.category}
            placeholder="Entrer le type de bus"
          />
        </td>
        <td class="tableEdit">
          <InputNumber
            selector={getCapacity()}
            onChange={onCapacityInputChanged}
          />
        </td>
        <TableElement text="-" />
        <TableElement text="-" />
        <td class="actionButtonContainer">
          <ButtonIcon icon={<CheckIcon />} onClick={toggleEditMode} />
          <ButtonIcon icon={<TrashIcon />} disable onClick={() => console.log("Cannot delete while editing")} />
        </td>
      </tr>
    </Show>
  );
}
