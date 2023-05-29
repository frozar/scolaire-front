import { JSX } from "solid-js";
import "./button.css";

export default function (props: {
  onClickHandler: () => void;
  children?: JSX.Element;
}) {
  // eslint-disable-next-line solid/reactivity
  const onClickHandler = props.onClickHandler;

  return (
    <button class="btn-generic" onClick={onClickHandler}>
      {props.children}
    </button>
  );
}
