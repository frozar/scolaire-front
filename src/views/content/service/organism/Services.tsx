import _ from "lodash";
import { JSXElement, createEffect, createSignal, on, onMount } from "solid-js";
import { ServiceGrid } from "./ServiceGrid";
import { ServiceList } from "./ServiceList";

import { ServiceStore } from "../../../../_stores/service.store";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import { ServiceGridButtons } from "../molecule/ServiceGridButtons";
import { selectedService } from "../template/ServiceTemplate";
import { currentGraphic } from "./FlatGraphics";
import "./Service.css";

export type ServiceType = {
  id: number;
  name: string;
  serviceGroupId: number;
  flatGraphicId: number;
  serviceTrips: ServiceTrip[];
};

export type ServiceTrip = {
  tripId: number;
  hlp: number; // in minutes
  endHour: number; // in minutes
  startHour: number; // in minutes
  waitingTime: number; // in minutes
};

export const [services, setServices] = createSignal<ServiceType[]>([]);
export const [servicesBeforeModification, setServicesBeforeModification] =
  createSignal<ServiceType[]>([]);

export const [refScroll, setRefScroll] = createSignal<HTMLDivElement>(
  document.createElement("div")
);

export function Services(): JSXElement {
  createEffect(() => {
    setServices(
      ServiceStore.get().filter(
        (service) => service.flatGraphicId == currentGraphic()
      )
    );
  });

  createEffect(
    on(services, () => {
      const selectedServiceId = selectedService();
      if (!selectedServiceId) return;

      ServiceGridUtils.scrollToServiceStart(
        refScroll(),
        selectedServiceId,
        true
      );
    })
  );

  onMount(() => {
    setServicesBeforeModification(_.cloneDeep(services()));

    if (services().length > 0) {
      const firstServiceId = services()[0].id;
      ServiceGridUtils.scrollToServiceStart(refScroll(), firstServiceId, false);
    }
  });

  return (
    <div id="services">
      <ServiceGridButtons />

      <div id="services-displayed" ref={setRefScroll}>
        <ServiceList />
        <ServiceGrid />
      </div>
    </div>
  );
}
