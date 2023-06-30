import { JSX, splitProps } from "solid-js";
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
    local.xOffset == "left" ? "left-[-150px]" : "left-[70px]";

  // TODO creer un signal pour gérer l'affichage du tooltip

  return (
    <button class="menu-btn" {...rest}>
      <div class={`absolute ${xOffset()} scale-100`}>
        <Tooltip tooltip={local.tooltip} />
      </div>
      <div
        class="btn-fla btn-circle-fla"
        classList={{ active: local.isActive }}
      >
        <Icon />
      </div>
    </button>
  );
}
