import "./TableDataColor.css";

export function TableDataColor(props: { color: string }) {
  return (
    <td class="table-data-color">
      <input type="color" disabled value={props.color} />
    </td>
  );
}
