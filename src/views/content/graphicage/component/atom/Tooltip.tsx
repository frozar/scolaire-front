import "./Tooltip.css";

export interface TooltipProps {
  tooltip: string;
}

export default function (props: TooltipProps) {
  return <span class="tooltip">{props.tooltip}</span>;
}
