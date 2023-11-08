import { FaSolidPlus } from "solid-icons/fa";
import "./PlusIcon.css";

interface PlusIconProps {
  size?: number;
}

export default function (props: PlusIconProps) {
  return <FaSolidPlus class="plus-icon" {...props} />;
}
