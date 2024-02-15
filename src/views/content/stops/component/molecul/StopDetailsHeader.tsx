import { Accessor, Show } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setStopDetailsItem } from "../organism/StopDetails";
import "./StopDetailsHeader.css";

interface StopDetailsHeaderProps {
  stop: StopType;
  editing: Accessor<boolean>;
  toggleEditing: () => void;
}
export function StopDetailsHeader(props: StopDetailsHeaderProps) {
  function updateStopDetailsItemName(
    event: Event & { target: HTMLInputElement }
  ) {
    setStopDetailsItem((prev) => {
      if (!prev) return prev;
      return { ...prev, name: event.target.value };
    });
  }

  return (
    <header class="stop-details-header">
      <input
        type="text"
        value={props.stop?.name}
        disabled={!props.editing()}
        class="input-title"
        onChange={updateStopDetailsItemName}
      />
      <Show when={!props.editing()}>
        <ButtonIcon icon={<PencilIcon />} onClick={props.toggleEditing} />
      </Show>
    </header>
  );
}
