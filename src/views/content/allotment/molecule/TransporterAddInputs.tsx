import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";

interface TransporterAddInputsProps {
  name: string;
  type: string;
  nameChange: (name: string) => void;
  typeChange: (type: string) => void;
}

export function TransporterAddInputs(props: TransporterAddInputsProps) {
  return (
    <div class="transporter-add-input-container">
      <div class="transporter-add-input">
        <LabeledInputField
          label="Dénomination Transporteur"
          name="transporter"
          value={props.name}
          placeholder="Entrer un nom"
          onInput={(e) => props.nameChange(e.target.value)}
        />
      </div>
      <div class="transporter-add-input">
        <LabeledInputSelect
          variant="borderless"
          defaultValue={0}
          label="Type de prestataire"
          onChange={(e) => props.typeChange(e.toString())}
          options={[
            { value: 0, text: "Titulaire" },
            { value: 1, text: "Co-traitant" },
            { value: 2, text: "Sous-traitant" },
          ]}
        />
      </div>
    </div>
  );
}
