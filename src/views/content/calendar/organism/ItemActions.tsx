import { Show } from "solid-js";
import {
  PublicHolidayType,
  VacationPeriodType,
} from "../../../../_entities/calendar.entity";
import CheckIcon from "../../../../icons/CheckIcon";
import PencilIcon from "../../../../icons/PencilIcon";
import PlusIcon from "../../../../icons/PlusIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";

interface ItemActionsProps {
  item?: VacationPeriodType | PublicHolidayType;
  removeItem: () => void;
  appendItem: () => void;
  editMode: () => void;
  disabled: boolean;
}

export function ItemActions(props: ItemActionsProps) {
  function ItemActions() {
    return (
      <div class="flex gap-2">
        <ButtonIcon icon={<TrashIcon />} onClick={props.removeItem} />
        <Show
          when={props.disabled && props.item != undefined}
          fallback={
            <ButtonIcon icon={<CheckIcon />} onClick={props.editMode} />
          }
        >
          <ButtonIcon icon={<PencilIcon />} onClick={props.editMode} />
        </Show>
      </div>
    );
  }
  return (
    <Show when={props.item == undefined} fallback={<ItemActions />}>
      <ButtonIcon icon={<PlusIcon />} onClick={props.appendItem} />
    </Show>
  );
}
