import { For, createSignal } from "solid-js";
import Button from "../../../../component/atom/Button";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import { TransporterTableHeader } from "./TransporterTableHeader";
import { TransporterTableLine } from "./TransporterTableLine";

export function TransporterTable() {
  const [fakeData, setFakeData] = createSignal([
    { name: "Transporteur1", type: "Titulaire" },
    { name: "Transporteur2", type: "Co-traitant" },
    { name: "Transporteur3", type: "Sous-traitant" },
  ]);

  function addTransporter() {
    setFakeData((prev) => [
      ...prev,
      { name: "NewTransporter", type: "NewType" },
    ]);
  }

  return (
    <div class="p-10">
      <div>
        <Button label="Ajouter" onClick={addTransporter} />
      </div>
      <Table>
        <TransporterTableHeader />
        <TableContent>
          <For each={fakeData()}>
            {(item) => (
              <TransporterTableLine name={item.name} type={item.type} />
            )}
          </For>
        </TableContent>
      </Table>
    </div>
  );
}
