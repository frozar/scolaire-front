// import { animations, dragAndDrop } from "@formkit/drag-and-drop";
import { For, JSXElement, Show, createSignal, onMount } from "solid-js";
import Sortable from "sortablejs";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceTripsUtils } from "../../../../utils/serviceTrips.utils";
import { ServiceGridLineFirstDiv } from "../atom/ServiceGridLineFirstDiv";
import { ServiceGridItem } from "../molecule/ServiceGridItem";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceGridLine.css";
import { services, setServices } from "./Services";

interface ServiceGridLineProps {
  serviceIndex: number;
  width: string;
}

function onMoveSortable(sortable: Sortable, serviceIndex: number): void {
  const newTripIds = sortable.toArray().map((tripId) => Number(tripId));

  dragAndDropSetter(serviceIndex, newTripIds);
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  function trips() {
    const serviceTRips = [...services()[props.serviceIndex].serviceTrips];

    /*
    Drag and drop fix
      => adding a fake last trip that will not be showed nor dragged
    
    Aim is to prevent :
      "solidjs" Failed to execute 'insertBefore' on 'Node': 
      The node before which the new node is to be inserted is not a child of this node.
    */
    serviceTRips.push({
      tripId: -1,
      hlp: 0,
      endHour: 1440,
      startHour: 1439,
      waitingTime: 0,
    });
    return serviceTRips;
  }

  let sortable: Sortable;

  onMount(() => {
    sortable = new Sortable(ref(), {
      animation: 150,
      dataIdAttr: "data-id",
      onEnd: () => onMoveSortable(sortable, props.serviceIndex),
      dragClass: "dragged",
      handle: ".drag-handle",
      direction: "horizontal",
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
      <Show when={trips().length != 0}>
        <ServiceGridLineFirstDiv
          width={ServiceGridUtils.firstDivWidth(props.serviceIndex)}
        />
      </Show>
      <div class="service-grid-line" ref={setRef}>
        <For each={trips()}>
          {(serviceTrip, i) => {
            console.log("for each");

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

function dragAndDropSetter(serviceIndex: number, newTripIds: number[]): void {
  const _services = services();

  /*
    Drag and drop fix
      => do not take into account fake tripId
    
    Aim is to prevent :
      "solidjs" Failed to execute 'insertBefore' on 'Node': 
      The node before which the new node is to be inserted is not a child of this node.
    */
  newTripIds = newTripIds.filter((newTripId) => newTripId != -1);

  const serviceTrips = ServiceTripsUtils.getUpdatedService(
    _services[serviceIndex],
    newTripIds,
    false
  );

  _services[serviceIndex].serviceTrips = serviceTrips;

  setServices([..._services]);
}
