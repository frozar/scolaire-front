import { JSXElement } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import "./ServiceGridHlp.css";

export function ServiceGridHlp(): JSXElement {
  return (
    <div
      class="service-grid-item-hlp"
      style={{ width: ServiceGridUtils.getHlpWidth() }}
    />
  );
}
