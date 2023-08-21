import { Setter, createEffect, createSignal } from "solid-js";
// import { setRemoveRamassageConfirmation } from "../../../signaux";
import { SchoolType } from "../../../_entities/school.entity";
import Button from "../../../component/atom/Button";
import { setDataToEdit, toggleEditStop } from "./EditEtablissement";
import Checkbox from "./component/atom/Checkbox";
import TableCells from "./component/molecule/TableCell";

function handleClickEdit(item: SchoolType) {
  setDataToEdit(item);
  toggleEditStop();
}

// TODO To delete ? School delete desactivated
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleClickSuppression(item: SchoolType) {
  // setRemoveEtablissementConfirmation({ displayed: true, item });
}

export default function (props: {
  item: SchoolType;
  setEtablissements: Setter<SchoolType[]>;
}) {
  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  createEffect(() => {
    refCheckbox().checked = props.item.selected();
  });

  return (
    <tr>
      <TableCells>
        <Checkbox
          ariaDescribedby="etablissement-item"
          name="etablissement"
          ref={setRefCheckbox}
          onChange={() => {
            props.item.setSelected(refCheckbox().checked);
          }}
        />
      </TableCells>

      <TableCells>{props.item.name}</TableCells>
      <TableCells>
        {props.item.associated.reduce((acc, stop) => acc + stop.quantity, 0)}
      </TableCells>
      {/* TODO importer les lignes depuis Xano */}
      {/* <td>{props.item.lines.length}</td> */}
      <TableCells>todo</TableCells>
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
