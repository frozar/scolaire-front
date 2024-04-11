import { For } from "solid-js";
import { OrganizationType } from "../../../../_entities/organization.entity";
import { TableHeaderCol } from "../../../../component/table/atom/TableHeaderCol";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { TableHeader } from "../../../../component/table/molecule/TableHeader";
import { Table } from "../../../../component/table/organism/Table";
import { OrganizationsTableItem } from "../molecule/OrganizationsTableItem";

export function OrganizationsTable(props: {
  organizations: OrganizationType[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableHeaderCol text="Nom" end={false} />
        <TableHeaderCol text="Référent" end={false} />
        <TableHeaderCol text="Statut" end={false} />
        <TableHeaderCol text="Actions" end={true} />
      </TableHeader>

      <TableContent>
        <For each={props.organizations}>
          {(orga) => <OrganizationsTableItem organization={orga} />}
        </For>
      </TableContent>
    </Table>
  );
}
