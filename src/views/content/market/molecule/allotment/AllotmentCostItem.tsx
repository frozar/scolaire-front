import { Show, createSignal, onMount } from "solid-js";
import { AllotmentCostType } from "../../../../../_entities/allotment.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./AllotmentCostItem.css";
import { AllotmentCostItemInputs } from "./AllotmentCostItemInputs";

interface AllotmentCostItemProps {
  item: AllotmentCostType;
  edit: (newCost: AllotmentCostType, oldCost: AllotmentCostType) => void;
  delete: (cost: AllotmentCostType) => void;
}

export function AllotmentCostItem(props: AllotmentCostItemProps) {
  const [inEdit, setInEdit] = createSignal(false);
  const [localCost, setLocalCost] = createSignal<AllotmentCostType>(
    {} as AllotmentCostType
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

  function cancel() {
    setInEdit(false);
    setLocalCost(props.item);
  }

  function submit() {
    props.edit(localCost(), props.item);
    setInEdit(false);
  }

  return (
    <div>
      <CardWrapper>
        <Show
          fallback={
            <AllotmentCostItemInputs
              cancel={cancel}
              submit={submit}
              item={localCost()}
              itemSetter={setLocalCost}
            />
          }
          when={!inEdit()}
        >
          <div class="allotment-cost-item">
            <div>
              <p>
                {"Bus : " +
                  TripUtils.tripBusIdToString(props.item.busCategoryId)}
              </p>
              <p>{"Coût : " + props.item.cost + "€ / km"}</p>
              <p>{"Coût HLP : " + props.item.costHlp + "€ / km"}</p>
            </div>
            <div class="allotment-cost-buttons">
              <ButtonIcon
                icon={<UpdatePen />}
                onClick={() => setInEdit(true)}
              />
              <ButtonIcon
                icon={<TrashIcon />}
                onClick={() => props.delete(props.item)}
              />
            </div>
          </div>
        </Show>
      </CardWrapper>
    </div>
  );
}
