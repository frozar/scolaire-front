import { JSXElement, Show } from "solid-js";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./ServiceListItemMiddle.css";

interface ServiceListItemMiddleProps {
  isSelected: boolean;
}

export function ServiceListItemMiddle(
  props: ServiceListItemMiddleProps
): JSXElement {
  return (
    <div class="service-list-item-middle">
      <Show when={props.isSelected}>
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => console.log("TODO: Delete")}
        />
      </Show>
    </div>
  );
}
