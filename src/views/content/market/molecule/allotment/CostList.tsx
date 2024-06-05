import {
  Accessor,
  For,
  Setter,
  Show,
  createEffect,
  createSignal,
} from "solid-js";
import { TransporterCostType } from "../../../../../_entities/transporter.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { TripUtils } from "../../../../../utils/trip.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CostItem } from "./CostItem";
import { CostItemEdit } from "./CostItemEdit";
import "./CostList.css";

interface CostListProps {
  costs: TransporterCostType[];
  costUpdateCb: (costs: TransporterCostType[]) => void;
}

type LocalCostType = {
  content: Accessor<TransporterCostType>;
  setContent: Setter<TransporterCostType>;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export function CostList(props: CostListProps) {
  const [localCosts, setLocalCosts] = createSignal<LocalCostType[]>([]);

  createEffect(() => {
    setLocalCosts(
      props.costs.map((c) => {
        const [content, setContent] = createSignal<TransporterCostType>({
          busCategoryId: c.busCategoryId,
          cost: c.cost,
          costHlp: c.costHlp,
        });
        const [inEdit, setInEdit] = createSignal(false);

        const localCost = {
          content,
          setContent,
          inEdit,
          setInEdit,
        };

        return localCost;
      })
    );
    // eslint-disable-next-line solid/reactivity
  }, props.costs);

  function localCostToTransporterCost() {
    const list: TransporterCostType[] = [];
    localCosts().forEach((c) =>
      list.push({
        busCategoryId: c.content().busCategoryId,
        cost: c.content().cost,
        costHlp: c.content().costHlp,
      })
    );
    return list;
  }

  function addCost() {
    const [content, setContent] = createSignal<TransporterCostType>({
      busCategoryId: 0,
      cost: 0,
      costHlp: 0,
    });
    const [inEdit, setInEdit] = createSignal(true);

    setLocalCosts((prev) => {
      return [...prev, { content, setContent, inEdit, setInEdit }];
    });

    props.costUpdateCb(localCostToTransporterCost());
  }

  function enableEdit(cost: LocalCostType) {
    const costToEdit = localCosts().find((c) => c.content() == cost.content());
    if (costToEdit) costToEdit.setInEdit(true);
  }

  function deleteCost(cost: LocalCostType) {
    const costToDelete = localCosts().find(
      (c) => c.content() == cost.content()
    );

    if (costToDelete) {
      setLocalCosts((prev) => {
        return prev.filter((c) => c != costToDelete);
      });

      props.costUpdateCb(localCostToTransporterCost());
    }
  }

  function updateCost(
    toEdit: TransporterCostType,
    edited: TransporterCostType
  ) {
    const costToEdit = localCosts().find(
      (c) =>
        c.content().busCategoryId === toEdit.busCategoryId &&
        c.content().cost === toEdit.cost &&
        c.content().costHlp === toEdit.costHlp
    );

    if (costToEdit) {
      costToEdit.setContent(edited);
      costToEdit.setInEdit(false);
    }

    props.costUpdateCb(localCostToTransporterCost());
  }

  return (
    <div>
      <div class="cost-list-header">
        <p>Coûts :</p>
        <ButtonIcon icon={<PlusIcon />} onClick={addCost} />
      </div>
      <div class="cost-list">
        <For each={localCosts()}>
          {(item) => (
            <Show
              when={!item.inEdit()}
              fallback={
                <CostItemEdit
                  busCategoryId={item.content().busCategoryId}
                  cost={item.content().cost}
                  costHlp={item.content().costHlp}
                  submitCb={updateCost}
                />
              }
            >
              <CostItem
                busCategoryId={item.content().busCategoryId}
                cost={item.content().cost}
                costHlp={item.content().costHlp}
                deleteCb={() => deleteCost(item)}
                enableEditCb={() => enableEdit(item)}
                vehicleName={TripUtils.tripBusIdToString(
                  item.content().busCategoryId
                )}
              />
            </Show>
          )}
        </For>
      </div>
    </div>
  );
}
