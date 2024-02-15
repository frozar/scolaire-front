import { JSXElement } from "solid-js";
import { zoom } from "../organism/ServiceGrid";
import "./ServiceGridHlp.css";

interface ServiceGridHlpProps {
  width: number;
}

export function ServiceGridHlp(props: ServiceGridHlpProps): JSXElement {
  return (
    <div
      class="service-grid-item-hlp"
      style={{
        width: hlpWidth(props.width),
      }}
    />
  );
}

function hlpWidth(width: number): string {
  return String(width * zoom()) + "px";
}
