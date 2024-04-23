import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import Label from "../../board/component/atom/Label";
import "./FlatGraohicAddMenuInputs.css";

interface FlatGraphicAddMenuInputsProps {
  graphic: FlatGraphicType;
  onNameChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

export function FlatGraphicAddMenuInputs(props: FlatGraphicAddMenuInputsProps) {
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
