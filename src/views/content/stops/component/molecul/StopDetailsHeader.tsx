import { Accessor, Show } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";

import { InputTitle } from "../../../../../component/atom/InputTitle";
import { StopUtils } from "../../../../../utils/stop.utils";
import "./StopDetailsHeader.css";

interface StopDetailsHeaderProps {
  stop: StopType;
  editing: Accessor<boolean>;
  toggleEditing: () => void;
}

export function StopDetailsHeader(props: StopDetailsHeaderProps) {
  return (
    <header class="stop-details-header">
      <InputTitle
        active={props.editing()}
        defaultValue={props.stop.name}
        disabled={!props.editing()}
        onInput={(value) => StopUtils.updateStopDetailsItem({ name: value })}
      />

      <Show when={!props.editing()}>
        <ButtonIcon icon={<PencilIcon />} onClick={props.toggleEditing} />
      </Show>
    </header>
  );
}
