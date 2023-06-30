import { JSX, Show, createSignal } from "solid-js";

import Tooltip from "../atom/Tooltip";

import "./ButtonGraphicageRightMenu.css";

export type OffsetType = "left" | "right";

export interface ButtonGraphicageRightMenuProps {
  onClick: () => void;
  tooltip: string;
  icon: JSX.Element;
  xOffset: OffsetType;
  isActive?: boolean;
}

export default function (props: ButtonGraphicageRightMenuProps) {
  const [tooltipIsDisplayed, setTooltipIsDisplayed] = createSignal(false);

  const Icon = () => {
    return <>{props.icon}</>;
  };

  const xOffset = () =>
    props.xOffset == "left" ? "-translate-x-[185px]" : "-translate-x-[-35px]";

  return (
    <button class="menu-btn">
      <Show when={tooltipIsDisplayed()}>
        <div
          class={`absolute top-1/2 left-1/2 transform ${xOffset()} -translate-y-1/2`}
        >
          <Tooltip tooltip={props.tooltip} />
        </div>
      </Show>
      <div
        class="btn-fla btn-circle-fla"
        classList={{ active: props.isActive }}
        onMouseOver={() => setTooltipIsDisplayed(true)}
        onMouseLeave={() => setTooltipIsDisplayed(false)}
        onClick={() => props.onClick()}
      >
        <Icon />
      </div>
    </button>
  );
}
