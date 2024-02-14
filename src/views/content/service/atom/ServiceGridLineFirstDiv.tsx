import { JSXElement, Show } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { services } from "../organism/Services";

interface ServiceGridLineFirstDivProps {
  serviceIndex: number;
}

export function ServiceGridLineFirstDiv(
  props: ServiceGridLineFirstDivProps
): JSXElement {
  return (
    <Show when={services()[props.serviceIndex].serviceTrips.length != 0}>
      // TODO: TODO: Hide the div and remove it's text content
      <div
        class="service-grid-line-first-div"
        style={{ width: ServiceGridUtils.firstDivWidth(props.serviceIndex) }}
      >
        blank space
      </div>
    </Show>
  );
}
