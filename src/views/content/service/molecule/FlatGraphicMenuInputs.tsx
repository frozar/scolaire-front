import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import Label from "../../board/component/atom/Label";
import "./FlatGraphicMenuInputs.css";

interface FlatGraphicMenuInputsProps {
  graphic: FlatGraphicType;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

export function FlatGraphicMenuInputs(props: FlatGraphicMenuInputsProps) {
  return (
    <div class="flat-graphic-input">
      <Label label="Nom" for="name" />
      <input
        id={"name"}
        type="text"
        placeholder={"Entrer un nom"}
        value={props.graphic.name}
        onInput={(e) => props.onNameChange(e.target.value)}
      />
      <Label label="Couleur" for="color" />
      <input
        id="color"
        type="color"
        value={props.graphic.color}
        onInput={(e) => props.onColorChange(e.target.value)}
      />
    </div>
  );
}
