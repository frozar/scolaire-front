import { createSignal, createEffect, JSXElement } from "solid-js";
import CrossButton from "./CrossButton";
import { removeUserInformation } from "../signaux";

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current flex-shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

export default function (props: { id: number; children: string | JSXElement }) {
  const [divRef, setDivRef] = createSignal<HTMLElement | undefined>();

  createEffect(() => {
    divRef()?.addEventListener(
      "animationend",
      () => {
        removeUserInformation(props.id);
      },
      false
    );
  });

  return (
    <div
      class="alert alert-warning shadow-lg mt-2"
      style={{ width: "max-content" }}
    >
      <WarningIcon />
      <div class="v-snack--active">
        <div class="v-snack__wrapper" ref={setDivRef}>
          <div style={{ "padding-bottom": "2%" }}>{props.children}</div>
        </div>
      </div>
      <CrossButton id={props.id} />
    </div>
  );
}
