import _ from "lodash";
import { For, JSXElement, createEffect, createSignal, onMount } from "solid-js";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridTop } from "../molecule/ServiceGridTop";
import { hlpMatrix } from "../template/ServiceTemplate";
import { ServiceGridLine } from "./ServiceGridLine";
import { refScroll, services } from "./Services";

export const [zoom, setZoom] = createSignal(8);

export function ServiceGrid(): JSXElement {
  const [ref, setRef] = createSignal<HTMLDivElement>(
    document.createElement("div")
  );

  function gridWidthValue(): string {
    return String(zoom() * 1440) + "px";
  }

  onMount(() => {
    ServiceGridUtils.changeScrollingDirection(refScroll(), ref());
  });

  createEffect(() => {
    /*

    React on services() and hlpMatrix()
    
    It's purpose is to update serviceTripsOrdered when serviceTripIds is modified,
    (when a serviceTrip is added or deleted)

    */

    const _services = _.cloneDeep(services());

    const serviceTripIds = _services
      .flatMap((service) => service.tripIds)
      .sort((a, b) => a - b);

    const serviceTripOrderedIds = _services
      .flatMap((service) => service.serviceTripsOrdered)
      .map((serviceTrip) => serviceTrip.tripId)
      .sort((a, b) => a - b);

    // Avoiding infinite loop
    if (
      !_.isEqual(serviceTripIds, serviceTripOrderedIds) &&
      Object.keys(hlpMatrix()).length > 0
    ) {
      // TODO: Use that back, getUpdatedServices must not setServices() but
      // just get it

      // const updatedServices = ServiceGridUtils.getUpdatedServices(_services);
      // setServices(updatedServices);

      ServiceGridUtils.getUpdatedServices(_services);
    }
  });

  return (
    <div ref={setRef}>
      <ServiceGridTop width={gridWidthValue()} />
      <For each={services()}>
        {(service, i) => {
          return (
            <ServiceGridLine serviceIndex={i()} width={gridWidthValue()} />
          );
        }}
      </For>
    </div>
  );
}
