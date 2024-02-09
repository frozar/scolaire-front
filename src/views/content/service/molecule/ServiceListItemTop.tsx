import { JSXElement } from "solid-js";
import { LockIconClose } from "../../../../icons/LockIconClosed";
import { LockIconOpen } from "../../../../icons/LockIconOpen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { ServiceType } from "../organism/Services";
import {
  selectedService,
  setSelectedService,
} from "../template/ServiceTemplate";
import "./ServiceListItemTop.css";

interface ServiceListItemTopProps {
  isSelected: boolean;
  service: ServiceType;
}

export function ServiceListItemTop(props: ServiceListItemTopProps): JSXElement {
  function displayIcon(): JSXElement {
    return props.isSelected ? <LockIconOpen /> : <LockIconClose />;
  }

  return (
    <div class="service-list-item-top">
      <div
        class="service-list-item-top-name"
        classList={{ active: props.isSelected }}
      >
        {props.service.name}
      </div>
      <ButtonIcon
        icon={displayIcon()}
        onClick={() => onClick(props.service.id)}
      />
    </div>
  );
}

function onClick(serviceId: number): void {
  if (selectedService() != serviceId) {
    setSelectedService(serviceId);
  } else {
    setSelectedService();
  }
}
