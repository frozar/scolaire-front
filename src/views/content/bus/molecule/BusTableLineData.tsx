import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { BusCategoryType } from "../organism/Bus";
import "./BusTableLine.css";

interface TableLineDisplayDataProps {
  busItem: BusCategoryType;
  toggleEditFunction: () => void;
  deleteFunction: () => void;
}

export function BusTableLineData(props: TableLineDisplayDataProps) {
  function ShowAccess() {
    if (props.busItem.accessibility == "PMR")
      return "PMR (" + props.busItem.capacity_pmr + ")";
    return "Classique";
  }

  return (
    <TableRow>
      <TableData text={props.busItem.name} />
      <TableData text={props.busItem.category} />
      <TableData
        text={props.busItem.capacity + " | " + props.busItem.capacity_standing}
      />
      <TableData text={ShowAccess()} />
      <TableData
        text={
          props.busItem.length +
          " | " +
          props.busItem.width +
          " | " +
          props.busItem.height
        }
      />
      <TableData text="-" />
      <TableData text="-" />
      <TableDataChilds end={true}>
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleEditFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={props.deleteFunction} />
      </TableDataChilds>
    </TableRow>
  );
}
