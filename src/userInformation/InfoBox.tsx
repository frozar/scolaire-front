import { JSXElement, createEffect, createSignal } from "solid-js";
import { removeUserInformation } from "../signaux";
import CrossButton from "./CrossButton";

function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current flex-shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function (props: { id: number; children: string | JSXElement }) {
  const [divRef, setDivRef] = createSignal<HTMLElement | undefined>();
  // console.log("props", props);

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
      class="alert alert-info shadow-lg mt-2"
      style={{ width: "max-content" }}
    >
      <InfoIcon />
      <div class="v-snack--active">
        <div class="v-snack__wrapper" ref={setDivRef}>
          <div style={{ "padding-bottom": "2%" }}>{props.children}</div>
        </div>
      </div>
      <CrossButton id={props.id} />
    </div>
  );
}
