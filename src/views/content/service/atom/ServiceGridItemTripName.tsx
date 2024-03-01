import { JSXElement } from "solid-js";
import { zoom } from "../organism/ServiceGrid";

export function ServiceGridItemTripName(props: { name: string }): JSXElement {
  return (
    <div class="service-grid-item-trip-name">
      {zoom() > 1 ? props.name : ""}
    </div>
  );
}
