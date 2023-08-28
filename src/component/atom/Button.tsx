import { mergeProps } from "solid-js";
import "./Button.css";

export interface ButtonProps {
  onClick: () => void;
  label: string;
  variant?: "primary" | "borderless" | "danger";
  isDisabled?: boolean;
}

export default function (props: ButtonProps) {
  const mergedProps = mergeProps(
    { label: "NO LABEL", isDisabled: false, variant: "primary" },
    props
  );

  const className = () => `btn-${mergedProps.variant}`;

  return (
    <button
      class={className()}
      onClick={() => mergedProps.onClick()}
      disabled={mergedProps.isDisabled}
    >
      {mergedProps.label}
    </button>
  );
}
