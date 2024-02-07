import { JSXElement } from "solid-js";
import { ServiceType } from "../organism/Services";

import { LockIconClose } from "../../../../icons/LockIconClosed";
import { LockIconOpen } from "../../../../icons/LockIconOpen";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import {
  selectedService,
  setSelectedService,
} from "../template/ServiceTemplate";
import "./ServiceListItem.css";

interface ServiceListItemProps {
  service: ServiceType;
}

export function ServiceListItem(props: ServiceListItemProps): JSXElement {
  function isSelected(): boolean {
    return selectedService() == props.service.id;
  }

  function displayIcon(): JSXElement {
    return isSelected() ? <LockIconOpen /> : <LockIconClose />;
  }

  function onClick(): void {
    if (selectedService() != props.service.id) {
      setSelectedService(props.service.id);
    } else {
      setSelectedService();
    }
  }
  return (
    <div class="service-list-item" classList={{ active: isSelected() }}>
      <div class="service-list-item-top">
        <div
          class="service-list-item-top-name"
          classList={{ active: isSelected() }}
        >
          {props.service.name}
        </div>
        <ButtonIcon icon={displayIcon()} onClick={onClick} />
      </div>
      <div
        class="service-list-item-bottom"
        classList={{ active: isSelected() }}
      >
        {"Temps de trajet global : " + props.service.totalDuration}
      </div>
    </div>
  );
}
