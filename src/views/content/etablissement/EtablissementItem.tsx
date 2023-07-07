import { Setter, createEffect } from "solid-js";
// import { setRemoveRamassageConfirmation } from "../../../signaux";
import { EtablissementItemType } from "../../../type";
import { setDataToEdit, toggleEditStop } from "./EditEtablissement";
import TableActionButton from "./component/atom/TableActionButton";

function handleClickEdit(item: EtablissementItemType) {
  setDataToEdit(item);
  toggleEditStop();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleClickSuppression(item: EtablissementItemType) {
  // setRemoveEtablissementConfirmation({ displayed: true, item });
}

export default function (props: {
  item: EtablissementItemType;
  setEtablissements: Setter<EtablissementItemType[]>;
}) {
  let refCheckbox!: HTMLInputElement;

  createEffect(() => {
    refCheckbox.checked = props.item.selected;
  });

  return (
    <tr>
      <td class="flex items-center">
        <input
          aria-describedby="etablissement-item"
          name="etablissement"
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
          ref={refCheckbox}
        />
        {props.item.name}
      </td>
      <td>{props.item.quantity}</td>
      <td>{props.item.nbLine}</td>
      <td>
        <TableActionButton
          onClickHandler={() => handleClickEdit(props.item)}
          class="text-[#0CC683] hover:text-indigo-600 mr-2"
          label="Editer"
        />

        <button
          disabled
          // class="text-[#0CC683] hover:text-indigo-600"
          onClick={() => handleClickSuppression(props.item)}
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
