import { Show, createSignal, onMount } from "solid-js";
import { TransporterCostType } from "../../../../../_entities/transporter.entity";
import { SelectInput } from "../../../../../component/atom/SelectInput";
import CheckIcon from "../../../../../icons/CheckIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";
import "./CostItem.css";

interface CostItemProps {
  item: TransporterCostType;
  edit: (oldCost: TransporterCostType, newCost: TransporterCostType) => void;
  delete: (cost: TransporterCostType) => void;
}

export function CostItem(props: CostItemProps) {
  const [inEdit, setInEdit] = createSignal(false);
  const [localCost, setLocalCost] = createSignal<TransporterCostType>(
    {} as TransporterCostType
  );

  onMount(() => {
    setLocalCost(props.item);
    if (
      props.item.busCategoryId == 0 &&
      props.item.cost == 0 &&
      props.item.costHlp == 0
    )
      setInEdit(true);
  });

  function onCostChange(value: number) {
    setLocalCost((prev) => {
      return { ...prev, cost: value };
    });
  }

  function onCostHLPChange(value: number) {
    setLocalCost((prev) => {
      return { ...prev, costHlp: value };
    });
  }

  function onVehicleChange(value: number) {
    setLocalCost((prev) => {
      return { ...prev, busCategoryId: value };
    });
  }

  function submit() {
    props.edit(props.item, localCost());
    setInEdit(false);
  }

  return (
    <Show
      when={inEdit()}
      fallback={
        <div>
          <p>
            {"Bus : " + TripUtils.tripBusIdToString(props.item.busCategoryId)}
          </p>
          <p>{"Coût : " + localCost().cost + "€ / km"}</p>
          <p>{"Coût HLP : " + localCost().costHlp + "€ / km"}</p>
          <div class="cost-item-buttons">
            <ButtonIcon icon={<UpdatePen />} onClick={() => setInEdit(true)} />
            <ButtonIcon
              icon={<TrashIcon />}
              onClick={() => props.delete(props.item)}
            />
          </div>
        </div>
      }
    >
      <div>
        <div>
          <label>Bus :</label>
          <SelectInput
            options={getBus().map((bus) => {
              return { value: Number(bus.id), text: bus.name };
            })}
            onChange={(e) => onVehicleChange(Number(e))}
            defaultValue={props.item.busCategoryId}
            variant="borderless"
          />
        </div>
        <div>
          <label for="cost">Coût :</label>
          <input
            value={props.item.cost}
            type="number"
            id="cost"
            onInput={(e) => onCostChange(Number(e.target.value))}
          />
        </div>
        <div>
          <label for="costHlp">Coût HLP :</label>
          <input
            value={props.item.costHlp}
            type="number"
            id="costHlp"
            onInput={(e) => onCostHLPChange(Number(e.target.value))}
          />
        </div>
        <ButtonIcon icon={<CheckIcon />} onClick={submit} />
      </div>
    </Show>
  );
}
