import Button from "../../../../../component/atom/Button";
import "./AllotmentTabTopButtons.css";

interface AllotmentTabTopButtonsProps {
  cancel: () => void;
  submit: () => void;
}

export function AllotmentTabTopButtons(props: AllotmentTabTopButtonsProps) {
  return (
    <div class="confirmation-buttons">
      <Button label="Valider" onClick={props.submit} />
    </div>
  );
}
