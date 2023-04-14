import { createSignal, createEffect } from "solid-js";
import CrossButton from "./CrossButton";

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

const [divRef, setDivRef] = createSignal<HTMLElement | undefined>();
let refDivMessage: HTMLDivElement | undefined;

createEffect(() => {
  divRef()?.addEventListener(
    "animationend",
    () => {
      refDivMessage?.remove();
    },
    false
  );
});

export default function InfoBox(props: any) {
  return (
    <div
      class="alert alert-error shadow-lg mt-2 nav-notify "
      ref={refDivMessage}
      style="width: max-content"
    >
      <div class="">
        <ErrorIcon />
        <div class="nav-notify v-snack--active">
          <div class="v-snack__wrapper" ref={setDivRef}>
            {props.children}
          </div>
        </div>
        <CrossButton id={props.id} />
      </div>
    </div>
  );
}
