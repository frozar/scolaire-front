import { OrganizationType } from "../../../../_entities/organization.entity";
import { TableData } from "../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../component/table/molecule/TableRow";
import { EyeIcon } from "../../../../icons/EyeIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

export function OrganizationsTableItem(props: {
  organization: OrganizationType;
}) {
  return (
    <TableRow class="map-row-item">
      <TableData
        class="select-none"
        text={props.organization.name}
        end={false}
      />
      <TableData
        class="select-none"
        text={props.organization.referent.email}
        end={false}
      />
      <TableData
        class="select-none"
        text={props.organization.status}
        end={false}
      />
      <TableDataChilds end>
        <ButtonIcon onClick={() => console.log()} icon={<EyeIcon />} />
        <ButtonIcon onClick={() => console.log()} icon={<TrashIcon />} />
      </TableDataChilds>
    </TableRow>
  );
}
