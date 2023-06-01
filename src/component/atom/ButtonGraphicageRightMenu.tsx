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
    <div class="menu-btn group">
      <span class="tooltip group-hover:scale-100">{props.tooltip}</span>
      <label
        tabIndex={0}
        class="custom-btn btn-circle hover:bg-[#062F3F] hover:text-[#0cc683]"
        classList={{
          "bg-[#062F3F] text-[#0cc683]": props.isActive,
        }}
        onClick={handleClick}
      >
        <Icon />
      </label>
    </div>
  );
}
