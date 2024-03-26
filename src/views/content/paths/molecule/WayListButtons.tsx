import { Show } from "solid-js";
import Button from "../../../../component/atom/Button";
import "./WayListButtons.css";

interface WayListButtonsProps {
  canSave: boolean;
  cancel: () => void;
  submit: () => void;
}

export function WayListButtons(props: WayListButtonsProps) {
  return (
    <div class="way-list-buttons-container">
      <div class="way-list-buttons">
        <Button label="Annuler" variant="danger" onClick={props.cancel} />
        <Show when={props.canSave}>
          <Button label="Valider" onClick={props.submit} />
        </Show>
      </div>
    </div>
  );
}
