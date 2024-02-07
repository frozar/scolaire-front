import { createSignal, Show } from "solid-js";
import { TextInput } from "../../../../component/atom/TextInput";
import CheckIcon from "../../../../icons/CheckIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import InputNumber from "../../stops/component/atom/InputNumber";
import { TableElement } from "../atom/TableElement";
import "./TableLine.css";

type BusType = {
  name: string;
  capacity: number;
  trip: number;
  quantity: number;
};

function deleteRow() {
  console.log("deleteButton");
}

export function TableLine(props: BusType) {
  const [getEditMode, setEditMode] = createSignal(false);
  const toggleEditMode = () => setEditMode(!getEditMode());

  const [getCapacity, setCapacity] = createSignal({
    value: props.capacity,
    disabled: false,
  });

  const onNameInputChanged = (value: string) => {
    props.name = value;
    console.log(props);
  };

  const onCapacityInputChanged = (element: HTMLInputElement) => {
    props.capacity = Number(element.value);
    console.log(props);
  };

  return (
    <Show
      when={getEditMode()}
      fallback={
        <tr class="tableRow">
          <TableElement text={props.name} />
          <TableElement text={props.capacity.toString()} />
          <TableElement text={props.trip.toString()} />
          <TableElement text={props.quantity.toString()} />
          <td class="actionButtonContainer">
            <ButtonIcon icon={<UpdatePen />} onClick={toggleEditMode} />
            <ButtonIcon disable icon={<TrashIcon />} onClick={deleteRow} />
          </td>
        </tr>
      }
    >
      <tr class="tableRow">
        <td class="tableEdit">
          <TextInput
            onInput={onNameInputChanged}
            defaultValue={props.name}
            placeholder="Entrer le type de bus"
          />
        </td>
        <td class="tableEdit">
          <InputNumber
            selector={getCapacity()}
            onChange={onCapacityInputChanged}
          />
        </td>
        <TableElement text={props.trip.toString()} />
        <TableElement text={props.quantity.toString()} />
        <td class="actionButtonContainer">
          <ButtonIcon icon={<CheckIcon />} onClick={toggleEditMode} />
          <ButtonIcon icon={<TrashIcon />} disable onClick={deleteRow} />
        </td>
      </tr>
    </Show>
  );
}
