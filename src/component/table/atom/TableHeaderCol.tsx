import "./TableHeaderCol.css";

export function TableHeaderCol(props: { text: string }) {
  return <th class="table-header-item">{props.text}</th>;
}
