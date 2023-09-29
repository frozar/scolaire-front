import Button from "../../../../../component/atom/Button";
import "./BoardFooterActions.css";

export type addLineButtonType = { callback: () => void; label: string };

export default function (props: {
  nextStep: addLineButtonType;
  previousStep: addLineButtonType;
}) {
  return (
    <div class="board-footer-actions">
      <Button
        onClick={props.previousStep.callback}
        label={props.previousStep.label}
        variant="danger"
        isDisabled={false}
      />
      <Button
        onClick={props.nextStep.callback}
        label={props.nextStep.label}
        variant="primary"
        isDisabled={false}
      />
    </div>
  );
}
