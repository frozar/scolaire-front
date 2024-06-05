import { onMount } from "solid-js";
import {
  TransporterCostType,
  TransporterType,
  TransporterTypeType,
  TransporterVehicleType,
} from "../../../../../_entities/transporter.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { CircleCheckIcon } from "../../../../../icons/CircleCheckIcon";
import { CircleXMarkIcon } from "../../../../../icons/CircleXMarkIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CostList } from "./CostList";
import "./TransporterItem.css";
import { VehicleList } from "./VehicleList";

function idToType(id: number): TransporterTypeType {
  switch (id) {
    case 0:
      return "Titulaire";
    case 1:
      return "Co-traitant";
    case 2:
      return "Sous-traitant";
    default:
      return "Titulaire";
  }
}

function typeToId(type: TransporterTypeType) {
  switch (type) {
    case "Titulaire":
      return 0;
    case "Co-traitant":
      return 1;
    case "Sous-traitant":
      return 2;
  }
}

interface TransporterItemEditProps {
  cancel: () => void;
  submitCb: (toEdit: TransporterType, edited: TransporterType) => void;
  id: number;
  name: string;
  type: TransporterTypeType;
  vehicles: TransporterVehicleType[];
  costs: TransporterCostType[];
  allotmentId: number;
}

export function TransporterItemEdit(props: TransporterItemEditProps) {
  const initialTransporter = {} as TransporterType;
  const editedTransporter = {} as TransporterType;

  function onTypeChange(value: number) {
    editedTransporter.type = idToType(value);
  }

  function onNamechange(value: string) {
    editedTransporter.name = value;
  }

  function onVehicleChange(value: TransporterVehicleType[]) {
    editedTransporter.vehicles = value;
  }

  function onCostChange(value: TransporterCostType[]) {
    editedTransporter.costs = value;
  }

  onMount(() => {
    initialTransporter.name = props.name;
    initialTransporter.type = props.type;
    initialTransporter.vehicles = props.vehicles;
    initialTransporter.costs = props.costs;
    initialTransporter.id = props.id;
    initialTransporter.allotmentId = props.allotmentId;

    editedTransporter.name = props.name;
    editedTransporter.type = props.type;
    editedTransporter.vehicles = props.vehicles;
    editedTransporter.costs = props.costs;
    editedTransporter.id = props.id;
    editedTransporter.allotmentId = props.allotmentId;
  });

  return (
    <CardWrapper>
      <div class="transporter-item-container">
        <div>
          <div>
            <label class="inputs-label-offset" for="name">
              Nom :
            </label>
            <input
              class="transporter-name-input"
              value={props.name}
              type="text"
              id="name"
              onInput={(e) => onNamechange(e.target.value)}
            />
          </div>
          <div>
            <label class="inputs-label-offset">Type :</label>
            <SelectInput
              options={[
                { value: 0, text: "Titulaire" },
                { value: 1, text: "Co-traitant" },
                { value: 2, text: "Sous-traitant" },
              ]}
              onChange={(e) => onTypeChange(Number(e))}
              defaultValue={typeToId(props.type)}
              variant="borderless"
            />
          </div>
          <VehicleList
            vehicles={props.vehicles}
            vehicleUpdateCb={onVehicleChange}
          />
          <CostList costs={props.costs} costUpdateCb={onCostChange} />
        </div>
        <div class="transporter-item-buttons">
          <ButtonIcon icon={<CircleXMarkIcon />} onClick={props.cancel} />
          <ButtonIcon
            icon={<CircleCheckIcon />}
            onClick={() =>
              props.submitCb(initialTransporter, editedTransporter)
            }
          />
        </div>
      </div>
    </CardWrapper>
  );
}
