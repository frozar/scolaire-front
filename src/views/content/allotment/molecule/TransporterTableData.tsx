import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

interface TransporterTableDataProps {
  name: string;
  type: string;
  toggleFunction: () => void;
}

export function TransporterTableData(props: TransporterTableDataProps) {
  return (
    <TableRow>
      <TableData text={props.name} />
      <TableData text={props.type} />
      <TableData text="-" />
      <TableDataChilds end>
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={() => console.log("ye")} />
      </TableDataChilds>
    </TableRow>
  );
}
