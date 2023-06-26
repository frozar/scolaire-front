import { Setter, createEffect } from "solid-js";
import { setRemoveRamassageConfirmation } from "../../../signaux";
import { StopItemType } from "../../../type";
import { setDataToEdit, toggleEditStop } from "./EditRamassage";

function handleClickEdit(item: StopItemType) {
  setDataToEdit(item);
  toggleEditStop();
}

function handleClickSuppression(item: StopItemType) {
  setRemoveRamassageConfirmation({ displayed: true, item });
}

export default function (props: {
  item: StopItemType;
  setRamassages: Setter<StopItemType[]>;
}) {
  let refCheckbox!: HTMLInputElement;

  createEffect(() => {
    refCheckbox.checked = props.item.selected;
  });

  return (
    <tr>
      <td class="flex items-center">
        <input
          aria-describedby="ramassage-item"
          name="ramassage"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 relative right-2"
          onChange={(e) => {
            const isItemChecked = e.target.checked;
            const itemId = props.item.id;

            props.setRamassages((ramassage) =>
              ramassage.map((eta) =>
                eta.id === itemId ? { ...eta, selected: isItemChecked } : eta
              )
            );
          }}
          ref={refCheckbox}
        />
        {props.item.name}
      </td>
      <td>{props.item.quantity}</td>
      <td>{props.item.nbEtablissement}</td>
      <td>{props.item.nbLine}</td>
      <td>
        <button
          onClick={() => handleClickEdit(props.item)}
          class="text-[#0CC683] hover:text-indigo-600 mr-2"
        >
          Editer
        </button>

        <button
          class="text-[#0CC683] hover:text-indigo-600"
          onClick={() => handleClickSuppression(props.item)}
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
