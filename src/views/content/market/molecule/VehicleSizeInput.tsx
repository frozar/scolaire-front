import Label from "../../board/component/atom/Label";

interface VehicleSizeInputProps {
  defaultLength: number;
  defaultWidth: number;
  defaultHeight: number;
  onInputLength: (value: number) => void;
  onInputWidth: (value: number) => void;
  onInputHeight: (value: number) => void;
}

export function VehicleSizeInput(props: VehicleSizeInputProps) {
  return (
    <div>
      <p>Gabarit</p>
      <div class="grid grid-flow-row grid-cols-2 max-w-xs">
        <Label label="Longueur" for="vLength" />
        <input
          type="number"
          id="vLength"
          placeholder={props.defaultLength.toString()}
        />
        <Label label="Largeur" for="vWidth" />
        <input type="number" id="vWidth" placeholder="3" />
        <Label label="Hauteur" for="vHeight" />
        <input type="number" id="vHeight" placeholder="3" />
      </div>

      {/* <LabeledInputNumber
        label="Longueur"
        name="vLength"
        onInput={(e) => props.onInputLength(Number(e.target.value))}
        value={props.defaultLength}
        placeholder="20"
      />
      <LabeledInputNumber
        label="Largeur"
        name="vWidth"
        onInput={(e) => props.onInputWidth(Number(e.target.value))}
        value={props.defaultWidth}
        placeholder="3"
      />
      <LabeledInputNumber
        label="Longueur"
        name="vHeight"
        onInput={(e) => props.onInputHeight(Number(e.target.value))}
        value={props.defaultHeight}
        placeholder="3"
      /> */}
    </div>
  );
}
