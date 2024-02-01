import { For, JSXElement } from "solid-js";
import { ServiceGridLine } from "./ServiceGridLine";
import { ServiceType } from "./Services";

interface ServiceGridProps {
  services: ServiceType[];
}

export function ServiceGrid(props: ServiceGridProps): JSXElement {
  return (
    <div>
      <For each={props.services}>
        {(service) => (
          // <div class="h-20 w-[1000px] bg-red-500 border border-y-0" />
          <ServiceGridLine service={service} />
        )}
      </For>
    </div>
  );
}
