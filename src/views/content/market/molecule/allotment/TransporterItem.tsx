import { Show, createSignal } from "solid-js";
import { TransporterType } from "../../../../../_entities/transporter.entity";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../../icons/TrashIcon";
import UpdatePen from "../../../../../icons/UpdatePen";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";

interface TransporterItemProps {
  item: TransporterType;
  delete: (transport: TransporterType) => void;
}

export function TransporterItem(props: TransporterItemProps) {
  const [inEdit, setInEdit] = createSignal(false);

  return (
    <div>
      <CardWrapper>
        <Show when={!inEdit()} fallback={<div />}>
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
