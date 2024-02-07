import { JSXElement } from "solid-js";
import { SurroundedPlusIcon } from "../../../../icons/SurroundedPlusIcon";
import { ServiceGridUtils } from "../../../../utils/serviceGrid.utils";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { setServices } from "../organism/Services";
import "./ServiceListAdd.css";

export function ServiceListAdd(): JSXElement {
  return (
    <div id="service-list-add">
      <ButtonIcon
        icon={<SurroundedPlusIcon />}
        onClick={addService}
        class="m-10"
      />
    </div>
  );
}

function addService(): void {
  setServices((prev) => {
    const services = [...prev];

    ServiceGridUtils.addService(services);

    return services;
  });
}
