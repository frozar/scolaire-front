import { Accessor, Show } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import { StopUtils } from "../../../../../utils/stop.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./StopDetailsHeader.css";

interface StopDetailsHeaderProps {
  stop: StopType;
  editing: Accessor<boolean>;
  toggleEditing: () => void;
}
export function StopDetailsHeader(props: StopDetailsHeaderProps) {
  return (
    <header class="stop-details-header">
      <input
        type="text"
        value={props.stop?.name}
        disabled={!props.editing()}
        class="input-title"
        onChange={(element) =>
          StopUtils.updateStopDetailsItem({ name: element.target.value })
        }
      />
      <Show when={!props.editing()}>
        <ButtonIcon icon={<PencilIcon />} onClick={props.toggleEditing} />
      </Show>
    </header>
  );
}
