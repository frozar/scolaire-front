import { JSX, splitProps } from "solid-js";
import "./ButtonGraphicageRightMenu.css";

export interface ButtonMapProps {
  onClick?: () => void;
  tooltip: string;
  icon: JSX.Element;
  isActive?: boolean;
}

export default function (props: ButtonMapProps) {
  const [local, rest] = splitProps(props, ["tooltip", "icon", "isActive"]);
  const Icon = () => {
    return <>{local.icon}</>;
  };

  return (
    <button class="group menu-btn">
      <span class="tooltip group-hover:scale-100">{local.tooltip}</span>
      <div
        {...rest}
        class="btn-fla btn-circle-fla"
        classList={{ active: local.isActive }}
      >
        <Icon />
      </div>
    </button>
  );
}
