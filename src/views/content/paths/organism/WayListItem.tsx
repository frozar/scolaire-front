import { Show, createSignal } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setIsWayListEdit } from "./WayList";
import "./WayListItem.css";

interface WayListItemProps {
  way: WayType;
  delete: (way: WayType) => void;
}

export function WayListItem(props: WayListItemProps) {
  const [isEditMode, setIsEditMode] = createSignal(false);

  function toggleEdit() {
    if (isEditMode()) {
      setIsEditMode(false);
      setIsWayListEdit(false);
      return;
    }
    // if (isPathListEdit()) return;
    setIsEditMode(true);
    setIsWayListEdit(true);
  }

  return (
    <div class="way-list-item-container">
      <Show
        when={isEditMode()}
        fallback={
          <div class="way-list-item" onClick={toggleEdit}>
            <p>{props.way.name}</p>
            <p>{props.way.id}</p>
          </div>
        }
      >
        <div class="way-list-item-selected">
          <div class="flex gap-2">
            <p>{props.way.name}</p>
            <p>{props.way.id}</p>
          </div>
          <div class="flex gap-2">
            <ButtonIcon icon={<CircleCrossIcon />} onClick={toggleEdit} />
            <ButtonIcon
              icon={<TrashIcon />}
              onClick={() => props.delete(props.way)}
            />
          </div>
        </div>
      </Show>
    </div>
  );
}
