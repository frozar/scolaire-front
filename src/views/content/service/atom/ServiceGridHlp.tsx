import { JSXElement } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import "./ServiceGridHlp.css";

interface ServiceGridHlpProps {
  width: number;
}

export function ServiceGridHlp(props: ServiceGridHlpProps): JSXElement {
  return (
    <div
      class="service-grid-item-hlp"
      style={{
        width: ServiceGridUtils.widthCssValue(props.width),
      }}
    />
  );
}
