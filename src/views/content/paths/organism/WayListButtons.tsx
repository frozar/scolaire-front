import { Show } from "solid-js";
import Button from "../../../../component/atom/Button";
import { ViewManager } from "../../ViewManager";

interface WayListButtonsProps {
  canSave: boolean;
  submit: () => void;
}

export function WayListButtons(props: WayListButtonsProps) {
  return (
    <div class="flex justify-between ">
      <Button label="Annuler" variant="danger" onClick={ViewManager.paths} />
      <Show when={props.canSave}>
        <Button label="Valider" onClick={props.submit} />
      </Show>
    </div>
  );
}
