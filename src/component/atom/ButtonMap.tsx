import { IconTypes } from "solid-icons";
import { JSX } from "solid-js";

export interface ButtonMapProps {
  click: () => void;
  tooltip: string;
  icon: JSX.Element;
  _class?: boolean;
}

export default function (props: ButtonMapProps) {
  const handleClick = () => props.click();
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
          "bg-[#062F3F] text-[#0cc683]": props._class,
        }}
        onClick={handleClick}
      >
        <Icon />
      </label>
    </div>
  );
}
