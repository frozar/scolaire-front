import { JSXElement } from "solid-js";
import Button from "../../../../component/atom/Button";
import { servicesBeforeModification, setServices } from "../organism/Services";

export function ServiceGridModificationButtons(): JSXElement {
  return (
    <div>
      <Button onClick={cancel} label="Annuler" variant="danger" />
      <Button
        onClick={() => console.log("TODO: Appliquer modifications")}
        label="Valider"
      />
    </div>
  );
}

function cancel() {
  setServices([...servicesBeforeModification()]);
}
