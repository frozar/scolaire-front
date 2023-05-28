import { JSX } from "solid-js";

export default function (props: {
  onClickHandler: () => void;
  children?: JSX.Element;
}) {
  // eslint-disable-next-line solid/reactivity
  const onClickHandler = props.onClickHandler;

  return (
    <button
      class="btn-arret-export-import disabled:bg-gray-300 disabled:opacity-75"
      onClick={onClickHandler}
    >
      {props.children}
    </button>
  );
}
