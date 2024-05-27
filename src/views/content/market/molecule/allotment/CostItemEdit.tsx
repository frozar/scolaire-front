import { onMount } from "solid-js";
import { TransporterCostType } from "../../../../../_entities/transporter.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";
import "./CostItem.css";

interface CostItemEditProps {
  submitCb: (toEdit: TransporterCostType, edited: TransporterCostType) => void;
  busCategoryId: number;
  cost: number;
  costHlp: number;
}

export function CostItemEdit(props: CostItemEditProps) {
  const initialCost: TransporterCostType = {} as TransporterCostType;
  const editedCost: TransporterCostType = {} as TransporterCostType;

  function onCostChange(value: number) {
    editedCost.cost = value;
  }

  function onCostHLPChange(value: number) {
    editedCost.costHlp = value;
  }

  function onVehicleChange(value: number) {
    editedCost.busCategoryId = value;
  }

  onMount(() => {
    initialCost.busCategoryId = props.busCategoryId;
    initialCost.cost = props.cost;
    initialCost.costHlp = props.costHlp;

    editedCost.busCategoryId = props.busCategoryId;
    editedCost.cost = props.cost;
    editedCost.costHlp = props.costHlp;
  });

  return (
    <div class="cost-item-container">
      <div>
        <label>Bus :</label>
        <SelectInput
          options={getBus().map((bus) => {
            return { value: Number(bus.id), text: bus.name };
          })}
          onChange={(e) => onVehicleChange(Number(e))}
          defaultValue={props.busCategoryId}
          variant="borderless"
        />
      </div>
      <div>
        <label for="cost">Coût :</label>
        <input
          class="cost-input"
          value={props.cost}
          type="number"
          id="cost"
          onInput={(e) => onCostChange(Number(e.target.value))}
        />
      </div>
      <div>
        <label for="costHlp">Coût HLP :</label>
        <input
          class="cost-input"
          value={props.costHlp}
          type="number"
          id="costHlp"
          onInput={(e) => onCostHLPChange(Number(e.target.value))}
        />
      </div>
      <ButtonIcon
        icon={<CheckIcon />}
        onClick={() => props.submitCb(initialCost, editedCost)}
      />
    </div>
  );
}
