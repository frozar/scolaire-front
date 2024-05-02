import { For, createSignal } from "solid-js";
import { AllotmentCostType } from "../../../../../_entities/allotment.entity";
import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { AllotmentAddButtons } from "./AllotmentAddButtons";
import { AllotmentAddHeader } from "./AllotmentAddHeader";
import { AllotmentAddInputs } from "./AllotmentAddInputs";
import { AllotmentCostItem } from "./AllotmentCostItem";

interface AllotmentAddMenuProps {
  defaultName: string;
  defaultColor: string;
  cancel: () => void;
  submit: () => void;
  nameChange: (name: string) => void;
  colorChange: (color: string) => void;
  costchange: (cost: AllotmentCostType[]) => void;
}

export function AllotmentAddMenu(props: AllotmentAddMenuProps) {
  const [costs, setCosts] = createSignal<AllotmentCostType[]>([]);

  function addNewCost() {
    const newObj: AllotmentCostType = { busCategoryId: 0, cost: 0, costHlp: 0 };
    setCosts((prev) => {
      return [...prev, newObj];
    });
    props.costchange(costs());
  }

  function editInList(newCost: AllotmentCostType, oldCost: AllotmentCostType) {
    setCosts((prev) => {
      return prev.map((cost) => {
        if (cost == oldCost) return newCost;
        return cost;
      });
    });
    props.costchange(costs());
  }

  function deleteInList(costToDelete: AllotmentCostType) {
    setCosts((prev) => {
      return prev.filter((cost) => cost != costToDelete);
    });
    props.costchange(costs());
  }

  return (
    <div>
      <AllotmentAddHeader />
      <div class="allotment-add-border">
        <AllotmentAddInputs
          defaultColor={props.defaultColor}
          defaultName={props.defaultName}
          colorChange={props.colorChange}
          nameChange={props.nameChange}
        />
        <div>
          <div class="allotment-cost-header">
            <p>Ajouter un coût spécifique</p>
            <ButtonIcon icon={<CirclePlusIcon />} onClick={addNewCost} />
          </div>
          <div class="allotment-cost-list">
            <For each={costs()}>
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
        <AllotmentAddButtons cancel={props.cancel} submit={props.submit} />
      </div>
    </div>
  );
}
