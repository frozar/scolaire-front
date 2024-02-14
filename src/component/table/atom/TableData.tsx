import { mergeProps } from "solid-js";

import "./TableData.css";

interface TableDataProps {
  text: string;
  end?: boolean;
}
export function TableData(props: TableDataProps) {
  const mergedProps = mergeProps({ end: false }, props);
  return (
    <td
      class="table-data"
      classList={{
        end: mergedProps.end,
      }}
    >
      {props.text}
    </td>
  );
}
