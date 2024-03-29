import { Show, createSignal } from "solid-js";
import { WayType } from "../../../../_entities/way.entity";
import { CircleCrossIcon } from "../../../../icons/CircleCrossIcon";
import TrashIcon from "../../../../icons/TrashIcon";
import { displayWays, setDisplayWays } from "../../_component/organisme/Ways";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setIsWayListEdit } from "../organism/WayList";
import "./WayListItem.css";

interface WayListItemProps {
  way: WayType;
  canDelete: boolean;
  delete: (way: WayType) => void;
}

export function WayListItem(props: WayListItemProps) {
  const [isEditMode, setIsEditMode] = createSignal(false);

  function toggleEdit() {
    if (isEditMode()) {
      setIsEditMode(false);
      setIsWayListEdit(false);
      setWaySelected(false);
      return;
    }
    setWaySelected(true);
    setIsEditMode(true);
    setIsWayListEdit(true);
  }

  function setWaySelected(value: boolean) {
    const tmpWays = displayWays();
    tmpWays.forEach((way) => {
      if (way.id == props.way.id) {
        way.selected = value;
      }
    });
    setDisplayWays([]);
    setDisplayWays(tmpWays);
  }

  return (
    <div class="way-list-item-container">
      <Show
        when={isEditMode()}
        fallback={
          <div class="way-list-item" onClick={toggleEdit}>
            <p>{props.way.name}</p>
          </div>
        }
      >
        <div class="way-list-item-selected">
          <div class="way-list-item-content">
            <p>{props.way.name}</p>
          </div>
          <div class="way-list-item-content justify-end">
            <ButtonIcon icon={<CircleCrossIcon />} onClick={toggleEdit} />
            <Show when={props.canDelete}>
              <ButtonIcon
                icon={<TrashIcon />}
                onClick={() => props.delete(props.way)}
              />
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}
