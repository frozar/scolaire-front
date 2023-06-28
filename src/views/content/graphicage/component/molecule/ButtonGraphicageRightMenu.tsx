import { JSX, Show, createSignal, splitProps } from "solid-js";
import Tooltip from "../atom/Tooltip";

import "./ButtonGraphicageRightMenu.css";

export type OffsetType = "left" | "right";

export interface ButtonMapProps {
  onClick?: () => void;
  tooltip: string;
  icon: JSX.Element;
  xOffset: OffsetType;
  isActive?: boolean;
}

export default function (props: ButtonMapProps) {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = createSignal(false);

  const [local, rest] = splitProps(props, [
    "tooltip",
    "icon",
    "isActive",
    "xOffset",
  ]);

  const Icon = () => {
    return <>{local.icon}</>;
  };

  const xOffset = () =>
    local.xOffset == "left" ? "-translate-x-[185px]" : "-translate-x-[-35px]";

  return (
    <button class="menu-btn">
      <div class="relative">
        <Show when={isTooltipDisplayed()}>
          <div
            class={`absolute top-1/2 left-1/2 transform ${xOffset()} -translate-y-1/2`}
          >
            <Tooltip tooltip={local.tooltip} />
          </div>
        </Show>
        <div
          class="btn-fla btn-circle-fla"
          classList={{ active: local.isActive }}
          onMouseOver={() => setIsTooltipDisplayed(true)}
          onMouseLeave={() => setIsTooltipDisplayed(false)}
          {...rest}
        >
          <Icon />
        </div>
      </div>
    </button>
  );
}
