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

  function onClick(): void {
    if (selectedService() != props.service.id) {
      setSelectedService(props.service.id);
    } else {
      setSelectedService();
    }
  }
  return (
    <div class="service-list-item-top">
      <div
        class="service-list-item-top-name"
        classList={{ active: props.isSelected }}
      >
        {props.service.name}
      </div>
      <ButtonIcon icon={displayIcon()} onClick={onClick} />
    </div>
  );
}
