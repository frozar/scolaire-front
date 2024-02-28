import Button from "../../../../component/atom/Button";
import "./TransporterAddMenu.css";

interface TransporterAddButtonsProps {
  cancel: () => void;
  submit: () => void;
}

export function TransporterAddButtons(props: TransporterAddButtonsProps) {
  return (
    <div class="transporter-add-buttons">
      <Button label="Annuler" variant="danger" onClick={props.cancel} />
      <Button label="Valider" onClick={props.submit} />
    </div>
  );
}
