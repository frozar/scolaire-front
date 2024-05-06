import { Show, createSignal, onMount } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./TransporterItem.css";
import { TransporterItemEdit } from "./TransporterItemEdit";

interface TransporterItemProps {
  item: TransporterType;
  edit: (oldTransport: TransporterType, newTransport: TransporterType) => void;
  delete: (transport: TransporterType) => void;
}

export function TransporterItem(props: TransporterItemProps) {
  const [inEdit, setInEdit] = createSignal(false);
  const [localTransporter, setLocalTransporter] = createSignal<TransporterType>(
    {} as TransporterType
  );

  onMount(() => {
    setLocalTransporter(props.item);
    if (props.item.id == 0 && props.item.type == "" && props.item.name == "")
      setInEdit(true);
  });

  function cancel() {
    setInEdit(false);
    setLocalTransporter(props.item);
  }

  function submit() {
    props.edit(props.item, localTransporter());
    setInEdit(false);
  }

  function hasCost() {
    if (localTransporter().costs)
      if (localTransporter().costs.length > 0) return "Avec";
    return "Sans";
  }

  return (
    <div>
      <CardWrapper>
        <Show
          when={!inEdit()}
          fallback={
            <TransporterItemEdit
              cancel={cancel}
              item={localTransporter()}
              itemSetter={setLocalTransporter}
              submit={submit}
            />
          }
        >
          <div class="transporter-item-container">
            <div>
              <p>{"Nom : " + props.item.name}</p>
              <p>{"Type : " + props.item.type}</p>
              <p>{"Véhicules : " + props.item.vehicles.length}</p>
              <p>{"Coût spécifique : " + hasCost()}</p>
            </div>
            <div class="transporter-item-buttons">
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
