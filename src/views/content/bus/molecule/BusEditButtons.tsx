import Button from "../../../../component/atom/Button";
import "./BusEditButtons.css";

interface BusEditButtonsProps {
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function BusEditButtons(props: BusEditButtonsProps) {
  return (
    <div class="bus-edit-buttons">
      <Button label="Annuler" variant="danger" onClick={props.cancelFunction} />
      <Button label="Valider" onClick={props.submitFunction} />
    </div>
  );
}
