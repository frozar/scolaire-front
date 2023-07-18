import { Setter, createEffect, createSignal } from "solid-js";
// import { setRemoveRamassageConfirmation } from "../../../signaux";
import Button from "../../../component/atom/Button";
import { EtablissementItemType } from "../../../type";
import { setDataToEdit, toggleEditStop } from "./EditEtablissement";
import Checkbox from "./component/atom/Checkbox";
import TableCells from "./component/molecule/TableCell";

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
      <TableCells>
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
      </TableCells>

      <TableCells>{props.item.name}</TableCells>
      <TableCells>{props.item.quantity}</TableCells>
      <TableCells>{props.item.nbLine}</TableCells>
      <TableCells>
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
      </TableCells>
    </tr>
  );
}
