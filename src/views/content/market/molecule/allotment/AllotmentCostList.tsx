import { For, Setter } from "solid-js";
import { AllotmentCostType } from "../../../../../_entities/allotment.entity";
import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getBus } from "../../../bus/organism/Bus";
import { AllotmentCostItem } from "./AllotmentCostItem";

interface AllotmentCostItemProps {
  costList: AllotmentCostType[];
  costSetter: Setter<AllotmentCostType[]>;
}

export function AllotmentCostList(props: AllotmentCostItemProps) {
  function addNewCost() {
    const newObj: AllotmentCostType = {
      busCategoryId: getBus()[0].id as number,
      cost: 0,
      costHlp: 0,
    };
    props.costSetter((prev) => {
      return [...prev, newObj];
    });
  }

  function editInList(newCost: AllotmentCostType, oldCost: AllotmentCostType) {
    props.costSetter((prev) => {
      return prev.map((cost) => {
        if (cost == oldCost) return newCost;
        return cost;
      });
    });
  }

  function deleteInList(costToDelete: AllotmentCostType) {
    props.costSetter((prev) => {
      return prev.filter((cost) => cost != costToDelete);
    });
  }

  return (
    <div>
      <div class="allotment-cost-header">
        <p>Ajouter un coût spécifique</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={addNewCost} />
      </div>
      <div class="allotment-cost-list">
        <For each={props.costList}>
          {(item) => (
            <AllotmentCostItem
              edit={editInList}
              delete={deleteInList}
              item={item}
            />
          )}
        </For>
      </div>
    </div>
  );
}
