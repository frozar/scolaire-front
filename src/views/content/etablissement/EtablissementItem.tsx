import { Setter, createEffect } from "solid-js";
// import { setRemoveRamassageConfirmation } from "../../../signaux";
import Button from "../../../component/atom/Button";
import { EtablissementItemType } from "../../../type";
import { setDataToEdit, toggleEditStop } from "./EditEtablissement";

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
        <span class="mr-2">
          <Button
            onClick={() => handleClickEdit(props.item)}
            label="Editer"
            variant="borderless"
          />
        </span>

        <Button
          onClick={() => handleClickSuppression(props.item)}
          label="Supprimer"
          variant="borderless"
          isDisabled={true}
        />
      </td>
    </tr>
  );
}
