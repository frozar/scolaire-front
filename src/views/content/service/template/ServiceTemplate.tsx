import { JSXElement } from "solid-js";
import { ServiceLeftBoard } from "../organism/ServiceLeftBoard";
import { Services } from "../organism/Services";

import "./ServiceTemplate.css";

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
