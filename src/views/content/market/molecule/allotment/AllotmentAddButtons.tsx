import Button from "../../../../../component/atom/Button";
import "./AllotmentAddMenu.css";

interface AllotmentAddButtonsProps {
  cancel: () => void;
  submit: () => void;
}

export function AllotmentAddButtons(props: AllotmentAddButtonsProps) {
  return (
    <div class="allotment-add-buttons">
      <Button onClick={props.cancel} label="Annuler" variant="danger" />
      <Button onClick={props.submit} label="Créer" />
    </div>
  );
}
