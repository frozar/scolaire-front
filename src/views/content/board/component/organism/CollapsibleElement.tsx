import { JSXElement, Show, createEffect, createSignal } from "solid-js";

import CollapseLogo from "../../../../../icons/CollapseLogo";
import UncollapseLogo from "../../../../../icons/UncollapseLogo";
import "./CollapsibleElement.css";

export default function (props: {
  children: JSXElement;
  title: string;
  class?: string;
  variant?: "bold-title";
}) {
  const [accordion, setAccordion] = createSignal<HTMLElement | undefined>();
  const [child, setChild] = createSignal<HTMLElement | undefined>();

  const [activated, setActivated] = createSignal<boolean>(true);

  createEffect(() => {
    accordion()?.addEventListener("click", () => {
      child()?.classList.toggle("display-accordion");

      setActivated(
        child()?.classList.value.includes("display-accordion") ?? false
      );
    });
  });

  return (
    <div class={"collapsible-element " + (props.class ?? "")}>
      <button ref={setAccordion} class="accordion">
        <p
          classList={{
            "font-bold": props.variant == "bold-title",
          }}
        >
          {props.title}
        </p>
        <div class="button-icon">
          <Show when={activated()} fallback={<UncollapseLogo />}>
            {<CollapseLogo />}
          </Show>
        </div>
      </button>
      <div class="accordion-panel display-accordion" ref={setChild}>
        {props.children}
      </div>
    </div>
  );
}
