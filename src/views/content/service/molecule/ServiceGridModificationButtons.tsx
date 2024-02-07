import { JSXElement } from "solid-js";
import Button from "../../../../component/atom/Button";

export function ServiceGridModificationButtons(): JSXElement {
  return (
    <div>
      <Button
        onClick={() => console.log("TODO: Annuler modif")}
        label="Annuler"
        variant="danger"
      />
      <Button
        onClick={() => console.log("TODO: Appliquer modifications")}
        label="Valider"
      />
    </div>
  );
}
