import { createEffect, createSignal, on, onMount } from "solid-js";
import { StopLineItem } from "../../type";
import { setDataToEdit, toggleEditStop } from "./EditStop";
import { addSelected, removeSelected, selected, setStop } from "./Arret";
import { isChecked } from "./Arret";

export default function (props: StopLineItem) {
  let checkbox!: HTMLInputElement;

  const handleClickEdit = () => {
    setDataToEdit({ ...props });
    toggleEditStop();
  };

  onMount(() => {
    checkbox?.addEventListener("change", () => {
      setStop(
        (stop) => stop.id == props.id,
        "selected",
        (selected) => !selected
      );

      const exist = selected().filter((stop) => stop.id == props.id);

      if (exist.length == 0) {
        addSelected(props);
      } else {
        removeSelected(props);
      }
    });
  });

  createEffect(
    on(
      () => isChecked(),
      () => {
        if (isChecked()) {
          checkbox.checked = true;
          addSelected(props);
        } else {
          checkbox.checked = false;
          removeSelected(props);
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
        {props.name}
      </td>
      <td>{props.quantity}</td>
      <td>{props.nbEtablissement}</td>
      <td>{props.nbLine}</td>
      <td>
        <a onClick={handleClickEdit} href="#" class="text-[#0CC683] mr-2">
          Editer
        </a>

        <a href="#" class="text-[#F44434]">
          Supprimer
        </a>
      </td>
    </tr>
  );
}
