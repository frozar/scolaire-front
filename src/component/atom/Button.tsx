import { mergeProps } from "solid-js";
import "./Button.css";

export interface ButtonProps {
  onClickHandler: () => void;
  label: string;
  isDisabled?: boolean;
}

export default function (props: ButtonProps) {
  const mergedProps = mergeProps(
    { label: "NO LABEL", isDisabled: false },
    props
  );

  return (
    <button
      class="btn-generic"
      onClick={() => mergedProps.onClickHandler()}
      disabled={mergedProps.isDisabled}
    >
      {mergedProps.label}
    </button>
  );
}
