import { Setter, createEffect } from "solid-js";
import { EtablissementItemType } from "../../type";
import { setDataToEdit, toggleEditStop } from "./EditEtablissement";
// import { setRemoveRamassageConfirmation } from "../../signaux";

export default function (props: {
  item: EtablissementItemType;
  setEtablissements: Setter<EtablissementItemType[]>;
}) {
  let checkbox!: HTMLInputElement;

  const handleClickEdit = () => {
    setDataToEdit({ ...props.item });
    toggleEditStop();
  };

  createEffect(() => {
    checkbox.checked = props.item.selected;
  });

  return (
    <tr>
      <td class="flex items-center">
        <input
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 relative right-2"
          onChange={(e) => {
            const isItemChecked = e.target.checked;
            const itemId = props.item.id;

            props.setEtablissements((etablissements) =>
              etablissements.map((eta) =>
                eta.id === itemId ? { ...eta, selected: isItemChecked } : eta
              )
            );
          }}
          ref={checkbox}
        />
        {props.item.name}
      </td>
      <td>{props.item.quantity}</td>
      <td>{props.item.nbLine}</td>
      <td>
        <a onClick={handleClickEdit} href="#" class="text-[#0CC683] mr-2">
          Editer
        </a>

        <a href="#">Supprimer</a>
      </td>
    </tr>
  );
}
