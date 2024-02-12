import { JSXElement } from "solid-js";
import { ServiceListHeader } from "../atom/ServiceListHeader";
import { zoom } from "../organism/ServiceGrid";
import { ServiceGridTop } from "./ServiceGridTop";

import "./ServiceGridHeader.css";

export function ServiceGridHeader(): JSXElement {
  // TODO: Move to utils
  function gridWidthValue(): string {
    return String(zoom() * 1440) + "px";
  }
  return (
    <div id="service-grid-header">
      <ServiceListHeader />
      <ServiceGridTop width={gridWidthValue()} />
    </div>
  );
}
