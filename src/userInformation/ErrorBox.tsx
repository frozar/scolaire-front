import { createSignal, createEffect } from "solid-js";
import CrossButton from "./CrossButton";
import { removeUserInformation } from "../signaux";

function ErrorIcon() {
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
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function (props: any) {
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
    <div class="alert alert-error shadow-lg mt-2" style="width: max-content">
      <ErrorIcon />
      <div class="v-snack--active">
        <div class="v-snack__wrapper" ref={setDivRef}>
          <div style="padding-bottom: 2%;">{props.children}</div>
        </div>
      </div>
      <CrossButton id={props.id} />
    </div>
  );
}
