import { FaSolidPlus } from "solid-icons/fa";
import "./PlusIcon.css";

interface PLusIconProps {
  size?: number;
}

export default function (props: PLusIconProps) {
  return <FaSolidPlus class="plus-icon" {...props} />;
}
