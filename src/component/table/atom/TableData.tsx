import "./TableData.css";

export function TableData(props: { text: string }) {
  return <td class="table-data">{props.text}</td>;
}
