import { JSXElement } from "solid-js";
import { ServiceType } from "../organism/Services";
import { selectedService } from "../template/ServiceTemplate";
import "./ServiceListItem.css";
import { ServiceListItemBottom } from "./ServiceListItemBottom";
import { ServiceListItemMiddle } from "./ServiceListItemMiddle";
import { ServiceListItemTop } from "./ServiceListItemTop";

interface ServiceListItemProps {
  service: ServiceType;
}

export function ServiceListItem(props: ServiceListItemProps): JSXElement {
  function isSelected(): boolean {
    return selectedService() == props.service.id;
  }

  return (
    <div class="service-list-item" classList={{ active: isSelected() }}>
      <ServiceListItemTop isSelected={isSelected()} service={props.service} />

      <ServiceListItemMiddle isSelected={isSelected()} />

      <ServiceListItemBottom
        isSelected={isSelected()}
        service={props.service}
      />
    </div>
  );
}
