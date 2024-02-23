import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
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

export function AllotmentTableLineData(props: TableLineDisplayDataProps) {
  return (
    <TableRow shown={true}>
      <TableData text={props.name} />
      <TableDataColor color={props.color} />
      <TableData text="-" />
      <TableData text="-" />
      <TableDataChilds end={true}>
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleEditFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteFunction} />
      </TableDataChilds>
    </TableRow>
  );
}