import { mergeProps } from "solid-js";
import "./Button.css";

export interface ButtonProps {
  onClick: () => void;
  label: string;
  variant?: "primary" | "borderless" | "danger";
  size?: "sm" | "md" | "2xl" | "3xl";
  isDisabled?: boolean;
  active?: boolean;
}

export default function (props: ButtonProps) {
  const mergedProps = mergeProps(
    {
      label: "NO LABEL",
      isDisabled: false,
      variant: "primary",
      size: "sm",
      active: false,
    },
    props
  );

  const activeClass = () => (mergedProps.active ? "active" : "");

  const className = () =>
    `btn-${mergedProps.variant} text-${mergedProps.size} ${activeClass()}`;

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
