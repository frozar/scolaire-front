import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { BusSizeType } from "./BusTableLine";
import "./BusTableLine.css";

interface TableLineDisplayDataProps {
  name: string;
  category: string;
  capacity: number;
  capacityStand: number;
  capacityPMR: number;
  access: string;
  toggleEditFunction: () => void;
  deleteFunction: () => void;
  size: BusSizeType;
}

export function BusTableLineData(props: TableLineDisplayDataProps) {
  function ShowAccess() {
    if (props.access == "PMR")
      return "PMR (" + props.capacityPMR.toString() + ")";
    return "Classique";
  }

  return (
    <TableRow>
      <TableData text={props.name} />
      <TableData text={props.category} />
      <TableData
        text={
          props.capacity.toString() + " | " + props.capacityStand.toString()
        }
      />
      <TableData text={ShowAccess()} />
      <TableData
        text={
          props.size.length +
          " | " +
          props.size.width +
          " | " +
          props.size.height
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
