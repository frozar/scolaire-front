import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { TableDataColor } from "../atom/TableDataColor";
import "./TableLine.css";

interface TableLineDisplayDataProps {
  name: string;
  color: string;
  toggleEditFunction: () => void;
  deleteFunction: () => void;
}

export function TableLineDisplayData(props: TableLineDisplayDataProps) {
  return (
    <tr class="tableRow">
      <TableData text={props.name} />
      <TableDataColor color={props.color} />
      <TableData text="-" />
      <TableData text="-" />
      <TableDataChilds>
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleEditFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteFunction} />
      </TableDataChilds>
    </tr>
  );
}
