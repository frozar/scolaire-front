import { createEffect, createSignal } from "solid-js";
import {
  TransporterType,
  TransporterVehicleType,
} from "../../../../_entities/transporter.entity";
import { TransporterService } from "../../../../_services/transporter.service";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { TransporterEditMenuHeader } from "../atom/TransporterEditMenuHeader";
import { TransporterEditMenuContent } from "./TransporterEditMenuContent";
import { VehicleList } from "./TransporterEditVehicles";

interface TransporterEditMenuProps {
  transporterItem: TransporterType;
  toggleFunction: () => void;
}

export function TransporterEditMenu(props: TransporterEditMenuProps) {
  const [getName, setName] = createSignal("");
  const [getType, setType] = createSignal("");
  const [getVehicles, setVehicles] = createSignal<TransporterVehicleType[]>([]);

  createEffect(() => {
    setName(props.transporterItem.name);
    setType(props.transporterItem.type);
    setVehicles(props.transporterItem.vehicles);
  });

  function onNameChange(value: string) {
    setName(value);
  }

  function onTypeChange(value: string) {
    setType(value);
  }

  function idToType(id: number) {
    switch (id) {
      case 0:
        return "Titulaire";
      case 1:
        return "Co-traitant";
      case 2:
        return "Sous-traitant";
    }
  }

  async function addVehicle() {
    const newVehicle = { license: "default", bus_category_id: 1 };
    await TransporterService.update({
      id: props.transporterItem.id,
      name: getName(),
      type: idToType(Number(getType())),
      allotment_id: props.transporterItem.allotment_id,
      vehicles: [...getVehicles(), newVehicle],
    });
    setVehicles((prev) => {
      return [...prev, newVehicle];
    });
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Véhicule ajouté",
    });
  }

  async function editTransporter() {
    await TransporterService.update({
      id: props.transporterItem.id,
      name: getName(),
      type: idToType(Number(getType())),
      allotment_id: props.transporterItem.allotment_id,
      vehicles: VehicleList(),
    });
    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.success,
      type: MessageTypeEnum.global,
      content: "Les modifications ont bien été apportées",
    });
    setVehicles(VehicleList());
  }

  return (
    <div>
      <TransporterEditMenuHeader title={props.transporterItem.name} />
      <TransporterEditMenuContent
        add={addVehicle}
        name={getName()}
        type={getType()}
        vehicles={getVehicles()}
        onNameChange={onNameChange}
        onTypeChange={onTypeChange}
        submit={editTransporter}
        toggle={props.toggleFunction}
      />
    </div>
  );
}
