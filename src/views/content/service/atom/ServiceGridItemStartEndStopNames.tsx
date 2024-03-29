import { JSXElement } from "solid-js";
import { zoom } from "../organism/ServiceGrid";
import "./ServiceGridItemStartEndStopNames.css";

interface ServiceGridItemStartEndStopNamesProps {
  startName: string;
  endName: string;
  width: string;
}

export function ServiceGridItemStartEndStopNames(
  props: ServiceGridItemStartEndStopNamesProps
): JSXElement {
  return (
    <>
      <div
        class="service-grid-item-start-stop-name"
        classList={{ "opacity-0": zoom() < 5 }}
        style={{ width: props.width }}
        title={props.startName}
      >
        {props.startName}
      </div>
      <div
        class="service-grid-item-end-stop-name"
        classList={{ "opacity-0": zoom() < 5 }}
        style={{ width: props.width }}
        title={props.endName}
      >
        {props.endName}
      </div>
    </>
  );
}
