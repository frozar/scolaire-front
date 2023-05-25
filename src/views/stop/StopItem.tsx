import { createEffect, on, onMount } from "solid-js";
import { StopItemType } from "../../type";
import { setDataToEdit, toggleEditStop } from "./EditStop";
import { addSelected, removeSelected, selected, setStop } from "./Stop";
import { isChecked } from "./Stop";
import { setRemoveRamassageConfirmation } from "../../signaux";

export default function (props: { item: StopItemType }) {
  let checkbox!: HTMLInputElement;
  const item = props.item;
  const handleClickEdit = () => {
    setDataToEdit({ ...item });
    toggleEditStop();
  };
  const handleClickDelete = () => {
    setRemoveRamassageConfirmation({
      displayed: true,
      item: item,
    });
  };
  onMount(() => {
    checkbox?.addEventListener("change", () => {
      setStop(
        (stop) => stop.id == item.id,
        "selected",
        (selected) => !selected
      );

      const exist = selected().filter((stop) => stop.id == item.id);

      if (exist.length == 0) {
        addSelected(item);
      } else {
        removeSelected(item);
      }
    });
  });

  createEffect(
    on(
      () => isChecked(),
      () => {
        if (isChecked()) {
          checkbox.checked = true;
          addSelected(item);
        } else {
          checkbox.checked = false;
          removeSelected(item);
        }
      }
    )
  );

  return (
    <tr>
      <td class="flex items-center">
        <input
          id="comments"
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 relative right-2"
          ref={checkbox}
        />
        {item.name}
      </td>
      <td>{item.quantity}</td>
      <td>{item.nbEtablissement}</td>
      <td>{item.nbLine}</td>
      <td>
        <a onClick={handleClickEdit} href="#" class="text-[#0CC683] mr-2">
          Editer
        </a>

        <a href="#">Supprimer</a>
      </td>
    </tr>
  );
}
