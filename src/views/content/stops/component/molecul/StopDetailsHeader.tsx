import { createSignal } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./StopDetailsHeader.css";

export default function (props: { stop: StopType }) {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();
  const [editStopName, setEditStopName] = createSignal<boolean>(true);
  const editName = () => {
    setEditStopName((bool) => !bool);
    inputRef()?.focus();
  };

  return (
    <header class="stop-details-header">
      <input
        type="text"
        value={props.stop?.name}
        ref={setInputRef}
        disabled={editStopName()}
        class="input-title"
      />
      <ButtonIcon icon={<PencilIcon />} onClick={editName} />
    </header>
  );
}
