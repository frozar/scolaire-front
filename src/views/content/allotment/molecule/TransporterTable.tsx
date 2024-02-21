import { For, createEffect, createSignal } from "solid-js";
import { TransporterType } from "../../../../_entities/transporter.entity";
import { TransporterService } from "../../../../_services/transporter.service";
import Button from "../../../../component/atom/Button";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import { TransporterTableHeader } from "./TransporterTableHeader";
import { TransporterTableLine } from "./TransporterTableLine";

export const [getAllTransporter, setAllTransporter] = createSignal<
  TransporterType[]
>([]);

export function TransporterTable(props: { allotment_id?: number }) {
  const [getTransporter, setTransporter] = createSignal<TransporterType[]>([]);

  createEffect(() => {
    setTransporter(
      getAllTransporter().filter((t) => t.allotment_id == props.allotment_id)
    );
  });

  async function addTransporter() {
    await TransporterService.create({
      name: "newTransporter",
      type: "Titulaire",
      allotment_id: Number(props.allotment_id),
      vehicles: [],
    });
  }

  return (
    <div class="p-10">
      <div>
        <Button label="Ajouter" onClick={addTransporter} />
      </div>
      <Table>
        <TransporterTableHeader />
        <TableContent>
          <For each={getTransporter()}>
            {(item) => <TransporterTableLine transporterItem={item} />}
          </For>
        </TableContent>
      </Table>
    </div>
  );
}
