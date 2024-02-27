import Button from "../../../../component/atom/Button";
import "./TransporterEditButtons.css";

interface TransporterEditButtonsProps {
  toggle: () => void;
  submit: () => void;
}

export function TransporterEditButtons(props: TransporterEditButtonsProps) {
  return (
    <div class="transporter-edit-buttons">
      <Button label="Annuler" variant="danger" onClick={props.toggle} />
      <Button label="Valider" onClick={props.submit} />
    </div>
  );
}
