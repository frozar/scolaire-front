import { OrganizationType } from "../../../../_entities/organization.entity";
import { TableData } from "../../../../component/table/atom/TableData";
import { TableRow } from "../../../../component/table/molecule/TableRow";

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
        text={props.organization.referent.name}
        end={true}
      />
    </TableRow>
  );
}
