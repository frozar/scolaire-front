import { JSX } from "solid-js";
import "./ButtonGraphicageRightMenu.css";

export interface ButtonMapProps {
  onClick: () => void;
  tooltip: string;
  icon: JSX.Element;
  isActive?: boolean;
}

export default function (props: ButtonMapProps) {
  const handleClick = () => props.onClick();
  const Icon = () => {
    return <>{props.icon}</>;
  };

  return (
    <div class="group menu-btn">
      <span class="tooltip group-hover:scale-100">{props.tooltip}</span>
      <div
        tabIndex={0}
        class="custom-btn btn-circle-fla"
        classList={{ active: props.isActive }}
        onClick={handleClick}
      >
        <Icon />
      </div>
    </div>
  );
}
