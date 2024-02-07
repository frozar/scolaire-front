import { JSXElement } from "solid-js";
import { ServiceType } from "../organism/Services";
import "./ServiceListItemBottom.css";

interface ServiceListItemBottomProps {
  service: ServiceType;
  isSelected: boolean;
}

export function ServiceListItemBottom(
  props: ServiceListItemBottomProps
): JSXElement {
  return (
    <div
      class="service-list-item-bottom"
      classList={{ active: props.isSelected }}
    >
      {/* TODO: Do not use raw value */}
      {"Temps de trajet global : 0"}
    </div>
  );
}
