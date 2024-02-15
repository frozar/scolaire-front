import { JSXElement } from "solid-js";

export function ServiceGridItemTripName(props: { name: string }): JSXElement {
  return <div class="service-grid-item-trip-name">{props.name}</div>;
}
