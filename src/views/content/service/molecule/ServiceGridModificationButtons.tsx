import _ from "lodash";
import { JSXElement } from "solid-js";
import { ServiceService } from "../../../../_services/service.service";
import Button from "../../../../component/atom/Button";
import {
  services,
  servicesBeforeModification,
  setServices,
  setServicesBeforeModification,
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
  setServices(_.cloneDeep(servicesBeforeModification()));
}

async function validate(): Promise<void> {
  // TODO: Ask confirmation ?
  const servicesId = services().map((service) => service.id);
  const servicesBeforeModificationId = servicesBeforeModification().map(
    (service) => service.id
  );
  // To delete list
  const idsToDelete = servicesBeforeModificationId.filter(
    (id) => !servicesId.includes(id)
  );

  // To add list
  const idsToAdd = servicesId.filter(
    (id) => !servicesBeforeModificationId.includes(id)
  );
  const servicesToAdd = services().filter((service) =>
    idsToAdd.includes(service.id)
  );

  // To modify list
  const servicesToModify = services()
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

  const data = await ServiceService.update({
    toAdd: servicesToAdd,
    toModify: servicesToModify,
    toDelete: idsToDelete,
  });

  setServices(data);
  setServicesBeforeModification(_.cloneDeep(data));
}
