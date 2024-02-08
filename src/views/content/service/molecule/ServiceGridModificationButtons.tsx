import _ from "lodash";
import { JSXElement } from "solid-js";
import Button from "../../../../component/atom/Button";
import {
  services,
  servicesBeforeModification,
  setServices,
} from "../organism/Services";

export function ServiceGridModificationButtons(): JSXElement {
  return (
    <div>
      <Button onClick={cancel} label="Annuler" variant="danger" />
      <Button onClick={validate} label="Valider" />
    </div>
  );
}

function cancel() {
  setServices([...servicesBeforeModification()]);
}

function validate(): void {
  // ! Demander confirmation !?
  const servicesId = services().map((service) => service.id);
  const servicesBeforeModificationId = servicesBeforeModification().map(
    (service) => service.id
  );
  // To delete list
  const idsToDelete = servicesBeforeModificationId.filter(
    (id) => !servicesId.includes(id)
  );
  console.log("idsToDelete", idsToDelete);

  // To add list
  const idsToAdd = servicesId.filter(
    (id) => !servicesBeforeModificationId.includes(id)
  );
  const servicesToAdd = services().filter((service) =>
    idsToAdd.includes(service.id)
  );
  console.log("servicesToAdd", servicesToAdd);

  // To modify list
  const serviceToModify = services()
    .filter((service) => !idsToAdd.includes(service.id))
    .filter(
      (service) =>
        !_.isEqual(
          service,
          servicesBeforeModification().filter(
            (_service) => _service.id == service.id
          )[0]
        )
    );

  console.log("serviceToModify", serviceToModify);

  // ! send in one request later processed by xano
  // ! request response must erase services()
}
