import { createSignal, createEffect, onMount, onCleanup } from "solid-js";
import CrossButton from "./CrossButton";

function SuccessIcon() {
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
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function InfoBox(props: any) {
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

  return (
    <div
      class="alert alert-success shadow-lg mt-2 nav-notify "
      ref={refDivMessage}
      style="width: max-content"
    >
      <div class="">
        <SuccessIcon />
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
