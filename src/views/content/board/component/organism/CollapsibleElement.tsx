import {
  JSXElement,
  Show,
  createEffect,
  createSignal,
  mergeProps,
  on,
} from "solid-js";

import CollapseLogo from "../../../../../icons/CollapseLogo";
import UncollapseLogo from "../../../../../icons/UncollapseLogo";
import "./CollapsibleElement.css";

export default function (props: {
  children: JSXElement;
  title: string;
  class?: string;
  titleClass?: "bold-title" | "text-xl";
  closedByDefault?: () => boolean;
}) {
  const mergedProps = mergeProps({ closedByDefault: () => false }, props);
  const toggleValue = () => mergedProps.closedByDefault();

  const [activated, setActivated] = createSignal<boolean>(
    // eslint-disable-next-line solid/reactivity
    toggleValue()
  );

  createEffect(
    on(toggleValue, () => {
      setActivated(!toggleValue());
    })
  );

  return (
    <div class={"collapsible-element " + (props.class ?? "")}>
      <button class="accordion" onClick={() => setActivated((prev) => !prev)}>
        <p
          classList={{
            "font-bold": props.titleClass == "bold-title",
            "text-xl": props.titleClass == "text-xl",
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
      <div
        class="accordion-panel"
        classList={{ "display-accordion": activated() }}
      >
        {props.children}
      </div>
    </div>
  );
}
