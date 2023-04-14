import { createSignal, createEffect } from "solid-js";
import CrossButton from "./CrossButton";

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
      class="alert alert-warning shadow-lg mt-2 nav-notify "
      ref={refDivMessage}
      style="width: max-content"
    >
      <div class="">
        <WarningIcon />
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
