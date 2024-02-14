import { mergeProps } from "solid-js";
import "./TableHeaderCol.css";

interface TableHeaderColProps {
  text: string;
  end?: boolean;
}

export function TableHeaderCol(props: TableHeaderColProps) {
  const mergedProps = mergeProps({ end: false }, props);

  return (
    <th
      scope="col"
      class="table-header-item"
      classList={{
        end: mergedProps.end,
      }}
    >
      {props.text}
    </th>
  );
}
