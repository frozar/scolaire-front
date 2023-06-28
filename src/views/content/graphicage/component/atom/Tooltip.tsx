import { splitProps } from "solid-js";

import "./Tooltip.css";

export interface TooltipProps {
  tooltip: string;
}

export default function (props: TooltipProps) {
  const [local] = splitProps(props, ["tooltip"]);

  return <span class="tooltip ">{local.tooltip}</span>;
}
