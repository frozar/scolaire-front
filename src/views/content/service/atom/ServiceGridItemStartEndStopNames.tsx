import { JSXElement } from "solid-js";
import "./ServiceGridItemStartEndStopNames.css";

interface ServiceGridItemStartEndStopNamesProps {
  startName: string;
  endName: string;
}

export function ServiceGridItemStartEndStopNames(
  props: ServiceGridItemStartEndStopNamesProps
): JSXElement {
  return (
    <>
      <div class="service-grid-item-start-stop-name">{props.startName}</div>
      <div class="service-grid-item-end-stop-name">{props.endName}</div>
    </>
  );
}
