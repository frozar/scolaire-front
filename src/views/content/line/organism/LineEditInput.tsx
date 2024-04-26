import { LineType } from "../../../../_entities/line.entity";
import { ColorPicker } from "../../../../component/atom/ColorPicker";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import "./LineEditInput.css";

interface LineEditInputProps {
  line: LineType;
  nameInput: (value: string) => void;
  colorInput: (color: string) => void;
}

export function LineEditInput(props: LineEditInputProps) {
  return (
    <div>
      <LabeledInputField
        label="Nom de la ligne"
        value={props.line?.name ?? "default name"}
        onInput={(e) => props.nameInput(e.target.value)}
        name="line-name"
        placeholder="Entrer le nom de la line"
      />
      <div class="color-picker-offset">
        <ColorPicker
          defaultColor={props.line.color()}
          title="Couleur de la ligne"
          onInput={props.colorInput}
          onChange={props.colorInput}
        />
      </div>
    </div>
  );
}
