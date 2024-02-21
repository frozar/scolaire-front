import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import "./TransporterEditInputs.css";

interface TransporterEditInputsProps {
  name: string;
  type: string;
  onNameChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function TransporterEditInputs(props: TransporterEditInputsProps) {
  return (
    <div class="transporter-edit-input-container">
      <div class="transporter-edit-input">
        <LabeledInputField
          label="Dénomination Transporteur"
          name="transporter"
          value={props.name}
          placeholder="Entrer un nom"
          onInput={(e) => props.onNameChange(e.target.value)}
        />
      </div>
      <div class="transporter-edit-input">
        <LabeledInputSelect
          defaultValue={0}
          label="Type de prestataire"
          onChange={(e) => props.onTypeChange(e.toString())}
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
