import { JSXElement } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import "./ServiceGridItemStartEndStopNames.css";

interface ServiceGridItemStartEndStopNamesProps {
  tripId: number;
}

export function ServiceGridItemStartEndStopNames(
  props: ServiceGridItemStartEndStopNamesProps
): JSXElement {
  return (
    <>
      <div class="service-grid-item-start-stop-name">
        {ServiceGridUtils.getStartStopName(props.tripId)}
      </div>
      <div class="service-grid-item-end-stop-name">
        {ServiceGridUtils.getEndStopName(props.tripId)}
      </div>
    </>
  );
}
