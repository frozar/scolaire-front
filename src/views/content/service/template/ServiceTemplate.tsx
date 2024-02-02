import { JSXElement, createSignal } from "solid-js";
import { ServiceLeftBoard } from "../organism/ServiceLeftBoard";
import { Services } from "../organism/Services";

import "./ServiceTemplate.css";

export const [selectedService, setSelectedService] = createSignal<number>();

export function ServiceTemplate(): JSXElement {
  return (
    <div>
      <div id="service-template">
        <ServiceLeftBoard />
        <Services />
      </div>
    </div>
  );
}
