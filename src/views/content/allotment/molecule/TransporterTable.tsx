import { For, Show, createEffect, createSignal } from "solid-js";
import { TransporterType } from "../../../../_entities/transporter.entity";
import { TransporterService } from "../../../../_services/transporter.service";
import Button from "../../../../component/atom/Button";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { TransporterAddMenu } from "./TransporterAddMenu";
import { TransporterTableHeader } from "./TransporterTableHeader";
import { TransporterTableLine } from "./TransporterTableLine";

export const [getAllTransporter, setAllTransporter] = createSignal<
  TransporterType[]
>([]);

export function TransporterTable(props: { allotment_id?: number }) {
  const [getTransporter, setTransporter] = createSignal<TransporterType[]>([]);
  const [newName, setNewName] = createSignal("");
  const [newType, setNewType] = createSignal("");
  const [isTransporterAddOpen, setIsTransporterAddOpen] = createSignal(false);

  createEffect(() => {
    setTransporter(
      getAllTransporter().filter((t) => t.allotment_id == props.allotment_id)
    );
  });

  function idToType(id: number) {
    switch (id) {
      case 0:
        return "Titulaire";
      case 1:
        return "Co-traitant";
      case 2:
        return "Sous-traitant";
      default:
        return "";
    }
  }

  async function addTransporter() {
    if (newName() == "" || newType() == "") {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Veuillez entrer un nom",
      });
      return;
    }
    enableSpinningWheel();
    await TransporterService.create({
      name: newName(),
      type: idToType(Number(newType())),
      allotment_id: Number(props.allotment_id),
      vehicles: [],
    });
    disableSpinningWheel();
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Transporteur créé",
    });
    resetChanges();
  }

  function onNameChange(name: string) {
    setNewName(name);
  }

  function onTypeChange(type: string) {
    setNewType(type);
  }

  function resetChanges() {
    setNewName("");
    setNewType("");
    setIsTransporterAddOpen(false);
  }

  return (
    <div class="p-10">
      <div>
        <Button
          label="Ajouter Transporteur"
          onClick={() => setIsTransporterAddOpen(true)}
        />
      </div>
      <Table>
        <TransporterTableHeader />
        <TableContent>
          <For each={getTransporter()}>
            {(item) => <TransporterTableLine transporterItem={item} />}
          </For>
        </TableContent>
      </Table>
      <Show when={isTransporterAddOpen()}>
        <TransporterAddMenu
          name={newName()}
          cancel={resetChanges}
          nameChange={onNameChange}
          submit={addTransporter}
          type={newType()}
          typeChange={onTypeChange}
        />
      </Show>
    </div>
  );
}
