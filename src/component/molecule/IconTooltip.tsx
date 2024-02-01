import { JSXElement, Show, createSignal } from "solid-js";
import Tooltip from "../../views/content/map/rightMapMenu/component/atom/Tooltip";

import "./IconTooltip.css";

export function IconToolTip(props: { icon: JSXElement; tooltipText: string }) {
  const [activeTooltip, setActiveTooltip] = createSignal<boolean>();
  const Icon = () => props.icon;

  return (
    <div class="icon-tooltip">
      <div
        onMouseOver={() => setActiveTooltip(true)}
        onMouseLeave={() => setActiveTooltip(false)}
        class="icon"
      >
        <Icon />
      </div>
      <Show when={activeTooltip()}>
        <div class="fixed">
          <Tooltip tooltip={props.tooltipText} />
        </div>
      </Show>
    </div>
  );
}
