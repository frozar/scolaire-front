import Button from "../../../../component/atom/Button";
import "./BusStopsMenuButtons.css";

interface BusStopsMenuButtons {
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusStopsMenuButtons(props: BusStopsMenuButtons) {
  return (
    <div class="bus-stop-menu-nav-buttons">
      <Button label="Annuler" variant="danger" onClick={props.cancelFunction} />
      <Button label="Valider" onClick={props.submitFunction} />
    </div>
  );
}
