import { createEffect } from "solid-js";
import { TableBodyRowProps } from "../atom/TableBodyRow";
import "./TableBodyRowCheckBox.css";

interface TableBodyRowCheckBoxProps extends TableBodyRowProps {
  checkboxHandler: (checked: boolean) => void;
  selected: () => boolean;
}

export default function (props: TableBodyRowCheckBoxProps) {
  let refCheckbox!: HTMLInputElement;

  createEffect(() => {
    refCheckbox.checked = props.selected();
  });

  return (
    <td class="flex items-center">
      <input
        aria-describedby="etablissement-item"
        name="etablissement"
        type="checkbox"
        class="table-body-row-checkbox"
        onChange={(e) => props.checkboxHandler(e.target.checked)}
        ref={refCheckbox}
      />
      {props.label}
    </td>
  );
}
