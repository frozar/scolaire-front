import Button from "../../../../../component/atom/Button";
import Label from "../../../board/component/atom/Label";
import LabeledInputField from "../../../board/component/molecule/LabeledInputField";

interface AllotmentAddMenuProps {
  defaultName: string;
  defaultColor: string;
  cancel: () => void;
  submit: () => void;
  nameChange: (name: string) => void;
  colorChange: (color: string) => void;
}

export function AllotmentAddMenu(props: AllotmentAddMenuProps) {
  return (
    <div>
      <div class="bg-green-base text-white py-2 px-4">
        <p>Ajouter un lot</p>
      </div>
      <div class="px-4 py-2 border-2 border-green-base">
        <div class="px-4 py-2 grid grid-flow-col gap-4">
          <div class="max-w-xs">
            <LabeledInputField
              label="Nom"
              name="name"
              placeholder="Entrer un nom"
              value={props.defaultName}
              onInput={(e) => props.nameChange(e.target.value)}
            />
          </div>
          <div class="max-w-xs grid mt-3">
            <Label label="Couleur" for="colorEdit" />
            <input
              id="colorEdit"
              type="color"
              value={props.defaultColor}
              onInput={(e) => props.colorChange(e.target.value)}
            />
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <Button onClick={props.cancel} label="Annuler" variant="danger" />
          <Button onClick={props.submit} label="Créer" />
        </div>
      </div>
    </div>
  );
}
