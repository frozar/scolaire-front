import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableElement } from "../../bus/atom/TableElement";
import "./TableLine.css";

interface TableLineDisplayDataProps {
  name: string;
  toggleEditFunction: () => void;
  deleteFunction: () => void;
}

export function TableLineDisplayData(props: TableLineDisplayDataProps) {
  return (
    <tr class="tableRow">
      <TableElement text={props.name} />
      <TableElement text="-" />
      <TableElement text="-" />
      <td class="actionButtonContainer">
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleEditFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteFunction} />
      </td>
    </tr>
  );
}
