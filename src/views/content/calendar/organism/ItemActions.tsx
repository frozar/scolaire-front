import { Show } from "solid-js";
import CheckIcon from "../../../../icons/CheckIcon";
import PencilIcon from "../../../../icons/PencilIcon";
import PlusIcon from "../../../../icons/PlusIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

interface ItemActionsProps {
  canAppend: boolean;
  isEditing: boolean;
  canEdit: boolean;
  removeItem: () => void;
  appendItem: () => void;
  editMode: () => void;
}

export function ItemActions(props: ItemActionsProps) {
  function ItemActions() {
    return (
      <Show when={props.canEdit}>
        <div class="flex gap-2">
          <ButtonIcon icon={<TrashIcon />} onClick={props.removeItem} />
          <Show
            when={props.isEditing}
            fallback={
              <ButtonIcon icon={<CheckIcon />} onClick={props.editMode} />
            }
          >
            <ButtonIcon icon={<PencilIcon />} onClick={props.editMode} />
          </Show>
        </div>
      </Show>
    );
  }

  return (
    <Show when={props.canAppend} fallback={<ItemActions />}>
      <ButtonIcon icon={<PlusIcon />} onClick={props.appendItem} />
    </Show>
  );
}
