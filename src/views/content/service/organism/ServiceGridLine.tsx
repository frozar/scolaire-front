import { dragAndDrop } from "@formkit/drag-and-drop";
import { For, JSXElement, Show, createSignal, onMount } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridLineFirstDiv } from "../atom/ServiceGridLineFirstDiv";
import { ServiceGridItem } from "../molecule/ServiceGridItem";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridLine.css";
import { services } from "./Services";

interface ServiceGridLineProps {
  serviceIndex: number;
  width: string;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );
  // TODO: Specify type
  onMount(() => {
    dragAndDrop({
      parent: ref(),
      getValues: services()[props.serviceIndex].serviceTripsOrdered,
      setValues: 
    });
  });
  return (
    <div
      ref={setRef}
      class={"service-grid-line"}
      style={{ width: props.width }}
      classList={{
        active: selectedService() == services()[props.serviceIndex].id,
      }}
    >
      <Show
        when={services()[props.serviceIndex].serviceTripsOrdered.length != 0}
      >
        <ServiceGridLineFirstDiv
          width={ServiceGridUtils.firstDivWidth(props.serviceIndex)}
        />
      </Show>

      <For each={services()[props.serviceIndex].serviceTripsOrdered}>
        {(serviceTrip, i) => {
          return (
            <ServiceGridItem
              serviceId={services()[props.serviceIndex].id}
              serviceTrip={serviceTrip}
              serviceTripIndex={i()}
              hlpWidth={serviceTrip.hlp}
              outsideScheduleRange={ServiceGridUtils.isOutsideRange(
                services()[props.serviceIndex],
                i()
              )}
            />
          );
        }}
      </For>
    </div>
  );
}
