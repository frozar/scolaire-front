import { For, Setter, createSignal, onMount } from "solid-js";
import {
  TransporterCostType,
  TransporterType,
} from "../../../../../_entities/transporter.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CostItem } from "./CostItem";
import "./CostList.css";

interface CostListProps {
  transporter: TransporterType;
  transporterSetter: Setter<TransporterType>;
}

export function CostList(props: CostListProps) {
  const [costs, setCosts] = createSignal<TransporterCostType[]>([]);

  onMount(() => {
    setCosts(props.transporter.costs);
  });

  function addVehicle() {
    const newObj: TransporterCostType = {
      busCategoryId: 0,
      cost: 0,
      costHlp: 0,
    };
    setCosts((prev) => {
      return [...prev, newObj];
    });
    // eslint-disable-next-line solid/reactivity
    props.transporterSetter((prev) => {
      return { ...prev, costs: costs() };
    });
  }

  function editCost(
    oldCost: TransporterCostType,
    newCost: TransporterCostType
  ) {
    setCosts((prev) => {
      return prev.map((cost) => {
        if (cost == oldCost) return newCost;
        return cost;
      });
    });
    // eslint-disable-next-line solid/reactivity
    props.transporterSetter((prev) => {
      return { ...prev, costs: costs() };
    });
  }

  function deleteCost(cost: TransporterCostType) {
    setCosts((prev) => {
      return prev.filter((c) => c != cost);
    });
    // eslint-disable-next-line solid/reactivity
    props.transporterSetter((prev) => {
      return { ...prev, costs: costs() };
    });
  }

  return (
    <div>
      <div class="cost-list-header">
        <p>Coûts :</p>
        <ButtonIcon icon={<PlusIcon />} onClick={addVehicle} />
      </div>
      <div class="cost-list">
        <For each={costs()}>
          {(item) => (
            <CostItem
              delete={deleteCost}
              edit={editCost}
              item={item}
              vehicleName={TripUtils.tripBusIdToString(item.busCategoryId)}
            />
          )}
        </For>
      </div>
    </div>
  );
}
