import { JSXElement } from "solid-js";
import { GridTopHour } from "../atom/GridTopHour";
import { GridTopMinutes } from "./GridTopMinutes";
import "./ServiceGridTop.css";

interface ServiceGridTopProps {
  width: string;
}

export function ServiceGridTop(props: ServiceGridTopProps): JSXElement {
  return (
    <div id="service-grid-top">
      <GridTopHour />
      <GridTopMinutes width={props.width} />
    </div>
  );
}
