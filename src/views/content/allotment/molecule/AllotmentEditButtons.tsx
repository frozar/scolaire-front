import Button from "../../../../component/atom/Button";
import "./AllotmentEditButtons.css";

interface AllotmentEditButtonsProps {
  cancelFunction: () => void;
  submitFunction: () => void;
}

export function AllotmentEditButtons(props: AllotmentEditButtonsProps) {
  return (
    <div class="allotment-edit-buttons">
      <Button label="Annuler" variant="danger" onClick={props.cancelFunction} />
      <Button label="Valider" onClick={props.submitFunction} />
    </div>
  );
}
