import { Accessor, For, Setter, Show } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import { CirclePlusIcon } from "../../../../../icons/CirclePlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import TransporterItem from "./TransporterItem";
import { TransporterItemEdit } from "./TransporterItemEdit";
import "./TransporterList.css";

interface AllotmentTransporterListProps {
  transporters: LocalTransporterType[];
  addCb: () => void;
  deleteCb: (item: LocalTransporterType) => void;
  updateCb: (toEdit: TransporterType, edited: TransporterType) => void;
  enableEditCb: (item: LocalTransporterType) => void;
  disableEditCb: (item: LocalTransporterType) => void;
}

type LocalTransporterType = {
  content: Accessor<TransporterType>;
  setContent: Setter<TransporterType>;
  inEdit: Accessor<boolean>;
  setInEdit: Setter<boolean>;
};

export function TransporterList(props: AllotmentTransporterListProps) {
  return (
    <div>
      <div class="transporter-list-header">
        <p>Ajouter un transporteur</p>
        <ButtonIcon icon={<CirclePlusIcon />} onClick={props.addCb} />
      </div>
      <div class="transporter-list-items">
        <For each={props.transporters}>
          {(item) => (
            <Show
              when={!item.inEdit()}
              fallback={
                <TransporterItemEdit
                  cancel={() => props.disableEditCb(item)}
                  costs={item.content().costs}
                  id={item.content().id as number}
                  allotmentId={item.content().allotmentId as number}
                  name={item.content().name}
                  submitCb={props.updateCb}
                  type={item.content().type}
                  vehicles={item.content().vehicles}
                />
              }
            >
              <TransporterItem
                costLenght={item.content().costs.length}
                deleteCb={() => props.deleteCb(item)}
                enableEditCb={() => props.enableEditCb(item)}
                name={item.content().name}
                type={item.content().type}
                vehicleLenght={item.content().vehicles.length}
              />
            </Show>
          )}
        </For>
      </div>
    </div>
  );
}
