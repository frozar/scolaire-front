import { dragAndDrop } from "@formkit/drag-and-drop";
import { For, JSXElement, Show, createSignal, onMount } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridLineFirstDiv } from "../atom/ServiceGridLineFirstDiv";
import { ServiceGridItem } from "../molecule/ServiceGridItem";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridLine.css";
import { services, setServices } from "./Services";

interface ServiceGridLineProps {
  serviceIndex: number;
  width: string;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  onMount(() => {
    dragAndDrop<number>({
      parent: ref(),
      getValues: () => dragAndDropGetter(props.serviceIndex),
      setValues: (newTripIds) =>
        dragAndDropSetter(props.serviceIndex, newTripIds),
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
      <div class="service-grid-line" ref={setRef}>
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
    </div>
  );
}

function dragAndDropGetter(serviceIndex: number): number[] {
  return services()[serviceIndex].serviceTripsOrdered.map(
    (serviceTrip) => serviceTrip.tripId
  );
}

function dragAndDropSetter(serviceIndex: number, newTripIds: number[]): void {
  setServices((prev) => {
    const _services = [...prev];
    const service = _services[serviceIndex];
    service.serviceTripsOrdered = newTripIds.map(
      (newTripId) =>
        service.serviceTripsOrdered.filter(
          (serviceTrip) => serviceTrip.tripId == newTripId
        )[0]
    );
    return _services;
  });
}
