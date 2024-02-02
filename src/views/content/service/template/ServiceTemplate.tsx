import { JSXElement } from "solid-js";
import { ServiceLeftBoard } from "../organism/ServiceLeftBoard";
import { Services } from "../organism/Services";

export function ServiceTemplate(): JSXElement {
  return (
    <div>
      <div class="flex">
        <ServiceLeftBoard />
        <Services />
      </div>
    </div>
  );
}
