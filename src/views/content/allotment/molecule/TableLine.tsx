import { Show, createSignal } from "solid-js";
import CheckIcon from "../../../../icons/CheckIcon";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../../bus/atom/TableElement";
import { TableElementInput } from "../../bus/atom/TableElementInput";
import { AllotmentType } from "../organism/Allotment";
import { TableLineDisplayData } from "./TableLineDisplayData";

interface TableLineProps {
  allotmentItem: AllotmentType;
}

export function TableLine(props: TableLineProps) {
  const [isInEditMode, setisInEditMode] = createSignal(false);

  // eslint-disable-next-line solid/reactivity
  const [getName, setName] = createSignal(props.allotmentItem.name);

  function toggleEditMode() {
    setisInEditMode(!isInEditMode());
  }

  function updateButton() {
    console.log("updateButton");
    toggleEditMode();
  }

  function deleteAllotment() {
    console.log("deleteAllotment");
    toggleEditMode();
  }

  function onNameInputChanged(value: string) {
    setName(value);
  }

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <TableLineDisplayData
          name={props.allotmentItem.name}
          toggleEditFunction={toggleEditMode}
          deleteFunction={deleteAllotment}
        />
      }
    >
      <tr class="tableRowEditing">
        <TableElementInput
          defaultValue={getName()}
          onInputFunction={onNameInputChanged}
          placeholder="Entrer un nom"
        />
        <TableElement text="-" />
        <TableElement text="-" />
        <td class="actionButtonContainer">
          <ButtonIcon icon={<CheckIcon />} onClick={updateButton} />
          <ButtonIcon icon={<CircleCrossIcon />} onClick={deleteAllotment} />
        </td>
      </tr>
    </Show>
  );
}
