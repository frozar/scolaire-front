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
      {"Temps de trajet global : " + props.service.totalDuration}
    </div>
  );
}
