import { createSignal, Show } from "solid-js";
import { BusCategoryType } from "../../../../_entities/bus.entity";
import { BusService } from "../../../../_services/bus.service";
import { TextInput } from "../../../../component/atom/TextInput";
import CheckIcon from "../../../../icons/CheckIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../atom/TableElement";
import "./TableLine.css";

interface TableLineProps {
  busItem: BusCategoryType;
}

export function TableLine(props: TableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

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
      category: getCategory(),
      capacity: getCapacity(),
    });
    toggleEditMode();
  }

  async function deleteButton() {
    await BusService.deleteBus(props.busItem.id);
  }

  function onCategoryInputChanged(value: string) {
    setCategory(value);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <tr class="tableRow">
          <TableElement text={getCategory()} />
          <TableElement text={getCapacity().toString()} />
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
            defaultValue={getCategory()}
            placeholder="Entrer le type de bus"
          />
        </td>
        <td class="tableEdit">
          <input
            type="Number"
            value={getCapacity()}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </td>
        <TableElement text="-" />
        <TableElement text="-" />
        <td class="actionButtonContainer">
          <ButtonIcon icon={<CheckIcon />} onClick={updateButton} />
          <ButtonIcon
            icon={<TrashIcon />}
            disable
            onClick={() => console.log("Cannot delete while editing")}
          />
        </td>
      </tr>
    </Show>
  );
}
