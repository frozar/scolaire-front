import { Show, createSignal, onMount } from "solid-js";
import { TransporterCostType } from "../../../../../_entities/transporter.entity";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./CostItem.css";
import { CostItemEdit } from "./CostItemEdit";

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
      <CostItemEdit
        costItem={localCost()}
        costSetter={setLocalCost}
        submit={submit}
      />
    </Show>
  );
}
