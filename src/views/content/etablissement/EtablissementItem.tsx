import { Setter, createEffect, createSignal } from "solid-js";
// import { setRemoveRamassageConfirmation } from "../../../signaux";
import Button from "../../../component/atom/Button";
import { EtablissementItemType } from "../../../type";
import { setDataToEdit, toggleEditStop } from "./EditEtablissement";
import Checkbox from "./component/atom/Checkbox";

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
  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  createEffect(() => {
    refCheckbox().checked = props.item.selected;
  });

  return (
    <tr>
      <td class="flex items-center">
        <Checkbox
          ariaDescribedby="etablissement-item"
          name="etablissement"
          ref={setRefCheckbox}
          onChange={() => {
            const isItemChecked = refCheckbox().checked;
            const itemId = props.item.id;

            props.setEtablissements((etablissements) =>
              etablissements.map((eta) =>
                eta.id === itemId ? { ...eta, selected: isItemChecked } : eta
              )
            );
          }}
        />
      </td>
      <td>{props.item.name}</td>
      <td>{props.item.quantity}</td>
      <td>{props.item.nbLine}</td>
      <td>
        <div class="flex gap-2">
          <Button
            onClick={() => handleClickEdit(props.item)}
            label="Editer"
            variant="borderless"
          />

          <Button
            onClick={() => handleClickSuppression(props.item)}
            label="Supprimer"
            variant="borderless"
            isDisabled={true}
          />
        </div>
      </td>
    </tr>
  );
}
