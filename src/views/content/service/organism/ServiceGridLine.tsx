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

function onMoveSortable(
  sortable: Sortable,
  serviceIndex: number
  // e: Sortable.SortableEvent
): void {
  // console.log("e", e);
  const newTripIds = sortable.toArray().map((tripId) => Number(tripId));
  // newTripIds.pop();
  // e.item.remove();
  dragAndDropSetter(serviceIndex, newTripIds);

  console.log("sortable", sortable);

  // console.log(sortable.toArray());
  // return false;
}

export function ServiceGridLine(props: ServiceGridLineProps): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  // const [trips, setTrips] = createSignal();
  function trips() {
    const serviceTRips = [...services()[props.serviceIndex].serviceTrips];
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
      // onMove: (e, eBis) => {
      //   // console.log("onMove => e, eBis", e, eBis);
      //   console.log("toarray =>", sortable.toArray());

      //   // return false;
      // },
      // onMove: () => onMoveSortable(sortable, props.serviceIndex),
      // onChange: (e) => onMoveSortable(sortable, props.serviceIndex, e),

      onEnd: () => onMoveSortable(sortable, props.serviceIndex),

      // onUpdate: (e) => console.log("onUpdate =>", e),
      // onChoose: (event) => console.log("onCHoose => event", event),
      // onUnchoose: (event) => console.log("unchoose event", event),
      // onAdd: (event) => console.log("onAdd => event", event),
      // onSort: (event) => console.log("onSort => event", event),
      // onChange: (event) => console.log("onChange => event", event),
      setData: (data, dragged) =>
        console.log("setData => data, dragged", data, dragged),
      dragClass: "dragged",
      handle: ".drag-handle",
      direction: "horizontal",
    });
    // dragAndDrop<number>({
    //   parent: ref(),
    //   getValues: () => dragAndDropGetter(props.serviceIndex),
    //   setValues: (newTripIds) =>
    //     dragAndDropSetter(props.serviceIndex, newTripIds),
    //   config: {
    //     plugins: [animations({ duration: 250 })],
    //     draggingClass: "dragged",
    //     dragHandle: ".drag-handle",
    //   },
    // });
  });

  // createEffect(() => console.log("services()", services()));

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

// function dragAndDropGetter(serviceIndex: number): number[] {
//   return services()[serviceIndex].serviceTrips.map(
//     (serviceTrip) => serviceTrip.tripId
//   );
// }

function dragAndDropSetter(serviceIndex: number, newTripIds: number[]): void {
  console.log("newTripIds", newTripIds);
  console.log("serviceIndex", serviceIndex);
  const _services = services();
  // newTripIds.pop();
  newTripIds = newTripIds.filter((newTripId) => newTripId != -1);
  const serviceTrips = ServiceTripsUtils.getUpdatedService(
    _services[serviceIndex],
    newTripIds,
    false
  );

  _services[serviceIndex].serviceTrips = serviceTrips;

  setServices([..._services]);

  // setServices((prev) => {
  //   const _services = [...prev];
  //   console.log("1");

  //   const serviceTrips = ServiceTripsUtils.getUpdatedService(
  //     _services[serviceIndex],
  //     newTripIds,
  //     false
  //   );
  //   console.log("2");

  //   _services[serviceIndex].serviceTrips = serviceTrips;
  //   console.log("3");

  //   return _services;
  // });
}
