import { IoCloseCircleOutline } from "solid-icons/io";
import { splitProps } from "solid-js";
import "./CloseButton.css";

export interface ButtonCloseProps {
  onClick?: () => void;
}

export default function (props: ButtonCloseProps) {
  const [, rest] = splitProps(props, []);

  return (
    <button class="btn-close" {...rest}>
      <IoCloseCircleOutline />
    </button>
  );
}
