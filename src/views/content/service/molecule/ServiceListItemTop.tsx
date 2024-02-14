import { JSXElement, Show } from "solid-js";
import { TextInput } from "../../../../component/atom/TextInput";
import { LockIconClose } from "../../../../icons/LockIconClosed";
import { LockIconOpen } from "../../../../icons/LockIconOpen";
import { BusServiceUtils } from "../../../../utils/busService.utils";
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

  function onInputText(serviceName: string): void {
    BusServiceUtils.updateServiceName(props.service.id, serviceName);
  }

  return (
    <div class="service-list-item-top">
      <Show
        when={!props.isSelected}
        fallback={
          <TextInput
            onInput={onInputText}
            defaultValue={props.service.name}
            class="service-list-item-top-name-input"
          />
        }
      >
        <div class="service-list-item-top-name">{props.service.name}</div>
      </Show>

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
