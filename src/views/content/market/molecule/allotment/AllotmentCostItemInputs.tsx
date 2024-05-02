import { Setter } from "solid-js";
import { AllotmentCostType } from "../../../../../_entities/allotment.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import { CircleCheckIcon } from "../../../../../icons/CircleCheckIcon";
import { CircleXMarkIcon } from "../../../../../icons/CircleXMarkIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";
import "./AllotmentCostItemInputs.css";

interface AllotmentCostItemInputsProps {
  item: AllotmentCostType;
  itemSetter: Setter<AllotmentCostType>;
  cancel: () => void;
  submit: () => void;
}

export function AllotmentCostItemInputs(props: AllotmentCostItemInputsProps) {
  function onBusChange(value: number) {
    props.itemSetter((prev) => {
      return { ...prev, busCategoryId: value };
    });
  }

  function onCostChange(value: number) {
    props.itemSetter((prev) => {
      return { ...prev, cost: value };
    });
  }

  function oncostHLPChange(value: number) {
    props.itemSetter((prev) => {
      return { ...prev, costHlp: value };
    });
  }

  return (
    <div class="inputs-container">
      <div>
        <div>
          <label class="inputs-label-offset">Bus :</label>
          <SelectInput
            options={getBus().map((bus) => {
              return { value: Number(bus.id), text: bus.name };
            })}
            onChange={(e) => onBusChange(Number(e))}
            defaultValue={props.item.busCategoryId}
            variant="borderless"
          />
        </div>
        <div>
          <label class="inputs-label-offset" for="cost">
            Coût :
          </label>
          <input
            class="inputs-number"
            value={props.item.cost}
            type="number"
            id="cost"
            onInput={(e) => onCostChange(Number(e.target.value))}
          />
        </div>
        <div>
          <label class="inputs-label-offset" for="costhlp">
            Coût HLP :
          </label>
          <input
            class="inputs-number"
            value={props.item.costHlp}
            type="number"
            id="costhlp"
            onInput={(e) => oncostHLPChange(Number(e.target.value))}
          />
        </div>
      </div>
      <div class="inputs-buttons">
        <ButtonIcon icon={<CircleXMarkIcon />} onClick={props.cancel} />
        <ButtonIcon icon={<CircleCheckIcon />} onClick={props.submit} />
      </div>
    </div>
  );
}
