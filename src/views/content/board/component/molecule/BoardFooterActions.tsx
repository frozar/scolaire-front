import { mergeProps } from "solid-js";
import Button from "../../../../../component/atom/Button";
import "./BoardFooterActions.css";

export type callbackButtonType = {
  callback: () => void;
  label: string;
  disable?: boolean;
};

export default function (props: {
  nextStep: callbackButtonType;
  previousStep: callbackButtonType;
}) {
  const finalProps = mergeProps({}, props);
  return (
    <div class="board-footer-actions">
      <Button
        onClick={props.previousStep.callback}
        label={props.previousStep.label}
        variant="danger"
        isDisabled={
          props.previousStep.disable ? props.previousStep.disable : false
        }
      />
      <Button
        onClick={props.nextStep.callback}
        label={props.nextStep.label}
        variant="primary"
        isDisabled={props.nextStep.disable ? props.nextStep.disable : false}
      />
    </div>
  );
}
