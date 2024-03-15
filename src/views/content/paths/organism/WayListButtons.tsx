import Button from "../../../../component/atom/Button";
import { ViewManager } from "../../ViewManager";

export function WayListButtons() {
  return (
    <div class="flex justify-between ">
      <Button label="Annuler" variant="danger" onClick={ViewManager.paths} />
      <Button label="Valider" onClick={() => console.log()} />
    </div>
  );
}
