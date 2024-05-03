import { Show, createSignal, onMount } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
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
  });

  function cancel() {
    setInEdit(false);
    setLocalTransporter(props.item);
  }

  function submit() {
    props.edit(props.item, localTransporter());
    setInEdit(false);
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
          <div class="flex justify-between">
            <div>
              <p>{"Nom : " + props.item.name}</p>
              <p>{"Type : " + props.item.type}</p>
            </div>
            <div class="flex gap-2">
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
