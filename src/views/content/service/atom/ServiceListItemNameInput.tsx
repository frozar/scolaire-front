import { JSXElement, Show } from "solid-js";
import { TextInput } from "../../../../component/atom/TextInput";
import { BusServiceUtils } from "../../../../utils/busService.utils";
import { ServiceType } from "../organism/Services";
import "./ServiceListItemNameInput.css";

interface ServiceListItemNameInputProps {
  service: ServiceType;
  isSelected: boolean;
}

export function ServiceListItemNameInput(
  props: ServiceListItemNameInputProps
): JSXElement {
  function onInputText(serviceName: string): void {
    BusServiceUtils.updateServiceName(props.service.id, serviceName);
  }

  return (
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
  );
}
