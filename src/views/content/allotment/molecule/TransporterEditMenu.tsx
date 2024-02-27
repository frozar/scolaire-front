import { createEffect, createSignal } from "solid-js";
import {
  TransporterType,
  TransporterVehicleType,
} from "../../../../_entities/transporter.entity";
import { TransporterService } from "../../../../_services/transporter.service";
import { addNewUserInformation } from "../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../type";
import { getBus } from "../../bus/organism/Bus";
import { setIsAllotmentEdited } from "../../market/molecule/allotment/AllotmentTab";
import { TransporterEditMenuHeader } from "../atom/TransporterEditMenuHeader";
import { TransporterEditMenuContent } from "./TransporterEditMenuContent";
import { setAllTransporter } from "./TransporterTable";

interface TransporterEditMenuProps {
  transporterItem: TransporterType;
  toggleFunction: () => void;
}

export const [getVehicles, setVehicles] = createSignal<
  TransporterVehicleType[]
>([]);

export function TransporterEditMenu(props: TransporterEditMenuProps) {
  const [getName, setName] = createSignal("");
  const [getType, setType] = createSignal("");

  createEffect(() => {
    setName(props.transporterItem.name);
    setType(props.transporterItem.type);
    setVehicles(props.transporterItem.vehicles);
  });

  function onNameChange(value: string) {
    setName(value);
    // eslint-disable-next-line solid/reactivity
    setAllTransporter((prev) => {
      return [...prev].map((item) => {
        if (item.id == props.transporterItem.id) {
          item.name = value;
        }
        return item;
      });
    });
    setIsAllotmentEdited(true);
  }

  function onTypeChange(value: string) {
    setType(value);
    // eslint-disable-next-line solid/reactivity
    setAllTransporter((prev) => {
      return [...prev].map((item) => {
        if (item.id == props.transporterItem.id) {
          item.type = idToType(Number(value));
        }
        return item;
      });
    });
    setIsAllotmentEdited(true);
  }

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

  async function addVehicle() {
    const newVehicle = {
      license: "AA-000-BB",
      bus_category_id: getBus()[0].id,
    };
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

  return (
    <div>
      <TransporterEditMenuHeader
        toggle={props.toggleFunction}
        title={props.transporterItem.name}
      />
      <TransporterEditMenuContent
        add={addVehicle}
        name={getName()}
        type={getType()}
        vehicles={getVehicles()}
        onNameChange={onNameChange}
        onTypeChange={onTypeChange}
      />
    </div>
  );
}
