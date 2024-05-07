import { Setter } from "solid-js";
import { TransporterCostType } from "../../../../../_entities/transporter.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";
import "./CostItem.css";

interface CostItemEditProps {
  costItem: TransporterCostType;
  costSetter: Setter<TransporterCostType>;
  submit: () => void;
}

export function CostItemEdit(props: CostItemEditProps) {
  function onCostChange(value: number) {
    props.costSetter((prev) => {
      return { ...prev, cost: value };
    });
  }

  function onCostHLPChange(value: number) {
    props.costSetter((prev) => {
      return { ...prev, costHlp: value };
    });
  }

  function onVehicleChange(value: number) {
    props.costSetter((prev) => {
      return { ...prev, busCategoryId: value };
    });
  }

  return (
    <div class="cost-item-container">
      <div>
        <label>Bus :</label>
        <SelectInput
          options={getBus().map((bus) => {
            return { value: Number(bus.id), text: bus.name };
          })}
          onChange={(e) => onVehicleChange(Number(e))}
          defaultValue={props.costItem.busCategoryId}
          variant="borderless"
        />
      </div>
      <div>
        <label for="cost">Coût :</label>
        <input
          class="cost-input"
          value={props.costItem.cost}
          type="number"
          id="cost"
          onInput={(e) => onCostChange(Number(e.target.value))}
        />
      </div>
      <div>
        <label for="costHlp">Coût HLP :</label>
        <input
          class="cost-input"
          value={props.costItem.costHlp}
          type="number"
          id="costHlp"
          onInput={(e) => onCostHLPChange(Number(e.target.value))}
        />
      </div>
      <ButtonIcon icon={<CheckIcon />} onClick={props.submit} />
    </div>
  );
}
