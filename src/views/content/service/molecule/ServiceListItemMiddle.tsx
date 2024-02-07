import { JSXElement, Show } from "solid-js";
import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { ServiceType, setServices } from "../organism/Services";
import { setSelectedService } from "../template/ServiceTemplate";
import "./ServiceListItemMiddle.css";

interface ServiceListItemMiddleProps {
  isSelected: boolean;
  service: ServiceType;
}

export function ServiceListItemMiddle(
  props: ServiceListItemMiddleProps
): JSXElement {
  return (
    <div class="service-list-item-middle">
      <Show when={props.isSelected}>
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => deleteService(props.service.id)}
        />
      </Show>
    </div>
  );
}

function deleteService(serviceId: number): void {
  setSelectedService();
  setServices((prev) => {
    const services = [...prev];
    return services.filter((service) => service.id != serviceId);
  });
}
