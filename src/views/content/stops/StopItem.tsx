import { Setter, createEffect, createSignal, onMount } from "solid-js";
import { StopType } from "../../../_entities/stop.entity";
import Button from "../../../component/atom/Button";
import { setRemoveStopConfirmation } from "../../../signaux";
import Checkbox from "../schools/component/atom/Checkbox";
import TableCell from "../schools/component/molecule/TableCell";
import { setDataToEdit, toggleEditStop } from "./EditStop";
import { globalChecked, setGlobalChecked } from "./StopsBoard";

function handleClickEdit(item: StopType) {
  setDataToEdit(item);
  toggleEditStop();
}

function handleClickSuppression(item: StopType) {
  setRemoveStopConfirmation({ displayed: true, item });
}

export default function (props: {
  item: StopType;
  setStops: Setter<StopType[]>;
}) {
  const [refCheckbox, setRefCheckbox] = createSignal<HTMLInputElement>(
    document.createElement("input")
  );

  onMount(() => {
    refCheckbox().checked = props.item.selected();
  });

  createEffect(() => {
    if (globalChecked()) refCheckbox().checked = globalChecked();
  });

  const checkBoxOnChange = () => {
    props.item.setSelected(refCheckbox().checked);
    if (!props.item.selected()) setGlobalChecked(false);
  };

  return (
    <tr>
      <TableCell>
        <Checkbox
          ariaDescribedby="school-item"
          name="school"
          ref={setRefCheckbox}
          onChange={checkBoxOnChange}
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
