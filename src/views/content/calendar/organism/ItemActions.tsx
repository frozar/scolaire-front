import { Show } from "solid-js";
import CheckIcon from "../../../../icons/CheckIcon";
import PencilIcon from "../../../../icons/PencilIcon";
import PlusIcon from "../../../../icons/PlusIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

export enum actionEnum {
  none,
  append,
  edit,
  isEditing,
}

interface ItemActionsProps {
  mode: actionEnum;
  removeItem: () => void;
  appendItem: () => void;
  editMode: () => void;
}

export function ItemActions(props: ItemActionsProps) {
  function ItemActions() {
    return (
      <Show when={props.mode >= actionEnum.edit}>
        <ButtonIcon icon={<TrashIcon />} onClick={props.removeItem} />
        <Show
          when={props.mode != actionEnum.isEditing}
          fallback={
            <ButtonIcon icon={<CheckIcon />} onClick={props.editMode} />
          }
        >
          <ButtonIcon icon={<PencilIcon />} onClick={props.editMode} />
        </Show>
      </Show>
    );
  }

  return (
    <Show when={props.mode == actionEnum.append} fallback={<ItemActions />}>
      <ButtonIcon icon={<PlusIcon />} onClick={props.appendItem} />
    </Show>
  );
}
