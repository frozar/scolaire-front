import { TransporterType } from "../../../../_entities/transporter.entity";
import { TransporterService } from "../../../../_services/transporter.service";
import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import TrashIcon from "../../../../icons/TrashIcon";
import UpdatePen from "../../../../icons/UpdatePen";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

interface TransporterTableDataProps {
  transporterItem: TransporterType;
  toggleFunction: () => void;
}

export function TransporterTableData(props: TransporterTableDataProps) {
  async function deleteButton() {
    await TransporterService.deleteTransporter(props.transporterItem.id);
    props.toggleFunction();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Le transporteur a bien été supprimé.",
    });
  }

  return (
    <TableRow>
      <TableData text={props.transporterItem.name} />
      <TableData text={props.transporterItem.type} />
      <TableData text={props.transporterItem.vehicles.length.toString()} />
      <TableDataChilds end>
        <ButtonIcon icon={<UpdatePen />} onClick={props.toggleFunction} />
        <ButtonIcon icon={<TrashIcon />} onClick={deleteButton} />
      </TableDataChilds>
    </TableRow>
  );
}
