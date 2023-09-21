import { JSXElement, Show, createEffect, createSignal } from "solid-js";

import CollapseLogo from "../../../../../icons/CollapseLogo";
import UncollapseLogo from "../../../../../icons/UncollapseLogo";
import "./CollapsibleElement.css";

export default function (props: { children: JSXElement; title: string }) {
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
    <div class="collapsible-element">
      <button ref={setAccordion} class="accordion">
        {props.title}
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
