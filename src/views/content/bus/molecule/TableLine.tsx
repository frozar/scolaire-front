import PencilIcon from "../../../../icons/PencilIcon";
import TrashIcon from "../../../../icons/TrashIcon";

type BusType = {
  name: string;
  capacity: number;
  trip: number;
  quantity: number;
};

function editRow() {
  console.log("editRow");
}

function deleteRow() {
  console.log("deleteButton");
}

export function TableLine(props: BusType) {
  return (
    <tr class="tableRow">
      <td>{props.name}</td>
      <td class="text-center">{props.capacity}</td>
      <td class="text-center">{props.trip}</td>
      <td class="text-center">{props.quantity}</td>
      <td class="actionButtonContainer">
        <div class="actionButton" onClick={editRow}>
          <PencilIcon />
        </div>
        <div class="actionButton" onClick={deleteRow}>
          <TrashIcon />
        </div>
      </td>
    </tr>
  );
}
