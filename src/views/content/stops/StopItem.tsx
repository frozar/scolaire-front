import { Setter, createEffect, createSignal } from "solid-js";
import { StopType } from "../../../_entities/stop.entity";
import Button from "../../../component/atom/Button";
import { setRemoveRamassageConfirmation } from "../../../signaux";
import Checkbox from "../schools/component/atom/Checkbox";
import TableCell from "../schools/component/molecule/TableCell";
import { setDataToEdit, toggleEditStop } from "./EditStop";

function handleClickEdit(item: StopType) {
  setDataToEdit(item);
  toggleEditStop();
}

function handleClickSuppression(item: StopType) {
  setRemoveRamassageConfirmation({ displayed: true, item });
}

export default function (props: {
  item: StopType;
  setStops: Setter<StopType[]>;
}) {
  // let refCheckbox!: HTMLInputElement;
  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  createEffect(() => {
    refCheckbox().checked = props.item.selected();
  });

  return (
    <tr>
      <TableCell>
        <Checkbox
          ariaDescribedby="school-item"
          name="school"
          ref={setRefCheckbox}
          onChange={() => {
            props.item.setSelected(refCheckbox().checked);
          }}
        />
      </TableCell>
      <TableCell>{props.item.name}</TableCell>
      <TableCell>
        {" "}
        {props.item.associated.reduce(
          (acc, school) => acc + school.quantity,
          0
        )}
      </TableCell>
      <TableCell>{props.item.associated.length}</TableCell>
      <TableCell>Todo</TableCell>
      <TableCell>
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
      </TableCell>
    </tr>
  );
}
