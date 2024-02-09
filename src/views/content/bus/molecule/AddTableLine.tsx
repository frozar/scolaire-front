import { createSignal } from "solid-js";
import { BusService } from "../../../../_services/bus.service";
import { TextInput } from "../../../../component/atom/TextInput";
import CheckIcon from "../../../../icons/CheckIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../atom/TableElement";
import { isAddLineHidden, setIsAddLineHidden } from "../organism/Bus";
import "./TableLine.css";

export function AddTableLine() {
  const [getCategory, setCategory] = createSignal("defaultBus");
  const [getCapacity, setCapacity] = createSignal(10);

  function onCategoryInputChanged(value: string) {
    setCategory(value);
  }

  async function createNewBus() {
    await BusService.create({
      category: getCategory(),
      capacity: getCapacity(),
    });
    setIsAddLineHidden(true);
  }

  function cancelButton() {
    setCategory("defaultBus");
    setCapacity(10);
    setIsAddLineHidden(true);
  }

  return (
    <tr
      classList={{ tableRowEditing: !isAddLineHidden() }}
      hidden={isAddLineHidden()}
    >
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
        <ButtonIcon icon={<CheckIcon />} onClick={createNewBus} />
        <ButtonIcon icon={<TrashIcon />} onClick={cancelButton} />
      </td>
    </tr>
  );
}
