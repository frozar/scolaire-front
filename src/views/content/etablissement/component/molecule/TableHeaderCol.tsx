import { Show, mergeProps } from "solid-js";
import "./TableHeaderCol.css";

interface TableHeaderColProps {
  label: string;
  class_?: string;
  checkBoxHandler?: (checked: boolean) => void;
  startItem?: boolean;
  endItem?: boolean;
}

let checkboxRef: HTMLInputElement;

export function getTableCheckboxRef() {
  return checkboxRef;
}

export default function (props: TableHeaderColProps) {
  const mergedProps = mergeProps(
    {
      checkBoxHandler: (e: boolean) => console.log(e),
    },
    props
  );

  return (
    <th
      scope="col"
      class="table-head-col"
      classList={{
        "pl-4 pr-3 sm:pl-0 flex items-center": props.startItem,
        "relative py-3.5 pl-3 pr-4 sm:pr-0": props.endItem,
      }}
    >
      <Show when={props.checkBoxHandler != undefined}>
        <input
          id="comments"
          aria-describedby="comments-description"
          name="comments"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 relative right-2"
          onChange={({ target }) => mergedProps.checkBoxHandler(target.checked)}
          ref={checkboxRef}
        />
      </Show>

      {props.label}
    </th>
  );
}
