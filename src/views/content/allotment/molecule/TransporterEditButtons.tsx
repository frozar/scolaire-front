import Button from "../../../../component/atom/Button";
import "./TransporterEditButtons.css";

interface TransporterEditButtonsProps {
  edit: () => void;
  submit: () => void;
}

export function TransporterEditButtons(props: TransporterEditButtonsProps) {
  return (
    <div class="transporter-edit-buttons">
      <Button label="Annuler" variant="danger" onClick={props.edit} />
      <Button label="Valider" onClick={props.submit} />
    </div>
  );
}
