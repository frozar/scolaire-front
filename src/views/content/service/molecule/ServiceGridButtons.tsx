import _ from "lodash";
import { JSXElement, Show } from "solid-js";
import { FlatGraphics } from "../organism/FlatGraphics";
import { services, servicesBeforeModification } from "../organism/Services";
import "./ServiceGridButtons.css";
import { ServiceGridModificationButtons } from "./ServiceGridModificationButtons";
import { ServiceGridZoomButtons } from "./ServiceGridZoomButtons";

export function ServiceGridButtons(): JSXElement {
  return (
    <div>
      <FlatGraphics />
      <div id="service-grid-buttons">
        <Show when={!_.isEqual(servicesBeforeModification(), services())}>
          <ServiceGridModificationButtons />
        </Show>

        <ServiceGridZoomButtons />
      </div>
    </div>
  );
}
