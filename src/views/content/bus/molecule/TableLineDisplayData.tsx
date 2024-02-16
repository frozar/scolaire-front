import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./TableLine.css";

interface TableLineDisplayDataProps {
  name: string;
  category: string;
  capacity: number;
  toggleEditFunction: () => void;
  deleteFunction: () => void;
}

export function TableLineDisplayData(props: TableLineDisplayDataProps) {
  return (
    <TableRow>
      <TableData text={props.name} />
      <TableData text={props.category} />
      <TableData text={props.capacity.toString()} />
      <TableData text="-" />
      <TableData text="-" />
      <TableDataChilds end={true}>
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleEditFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteFunction} />
      </TableDataChilds>
    </TableRow>
  );
}
