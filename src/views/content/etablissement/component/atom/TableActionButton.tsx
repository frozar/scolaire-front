import { mergeProps } from "solid-js";
import { ButtonProps } from "../../../../../component/atom/Button";

interface TableActionButtonProps extends ButtonProps {
  class?: string;
}

export default function (props: TableActionButtonProps) {
  const mergedProps = mergeProps({ isDisabled: false }, props);

  return (
    <button
      onClick={() => props.onClickHandler()}
      disabled={mergedProps.isDisabled}
      class={props.class}
    >
      {props.label}
    </button>
  );
}
