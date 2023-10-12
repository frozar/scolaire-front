import Button from "../../../../../component/atom/Button";
import "./BoardFooterActions.css";

export type addRaceButtonType = { callback: () => void; label: string };

export default function (props: {
  nextStep: addRaceButtonType;
  previousStep: addRaceButtonType;
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
