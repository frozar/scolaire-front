import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../atom/TableElement";
import "./TableLine.css";

interface TableLineDisplayDataProps {
  category: string;
  capacity: number;
  toggleEditFunction: () => void;
  deleteFunction: () => void;
}

export function TableLineDisplayData(props: TableLineDisplayDataProps) {
  return (
    <tr class="tableRow">
      <TableElement text={props.category} />
      <TableElement text={props.capacity.toString()} />
      <TableElement text="-" />
      <TableElement text="-" />
      <td class="actionButtonContainer">
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleEditFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteFunction} />
      </td>
    </tr>
  );
}
