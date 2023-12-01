import { mergeProps } from "solid-js";
import "./CustomButton.css";

interface CustomButtonProps {
  text: string;
  active: boolean;
  variant?: "primary";
  onClick: () => void;
}

export function CustomButton(props: CustomButtonProps) {
  const mergedProps = mergeProps({ variant: "primary" }, props);
  const active = () => props.active;

  return (
    <button
      class={"custom-button " + mergedProps.variant}
      classList={{ active: active() }}
      onClick={() => props.onClick()}
    >
      {props.text}
    </button>
  );
}
