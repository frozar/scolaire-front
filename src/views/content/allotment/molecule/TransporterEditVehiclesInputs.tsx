import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import "./TransporterEditVehicles.css";

interface TransporterEditVehiclesInputsProps {
  license: string;
  bus_id?: number;
  onLicenseChange: (license: string) => void;
  onTypeChange: (type: string) => void;
}

export function TransporterEditVehiclesInputs(
  props: TransporterEditVehiclesInputsProps
) {
  return (
    <div class="transporter-vehicles-input-container">
      <div class="transporter-vehicles-input">
        <LabeledInputField
          label="Immatriculation"
          name="license"
          value={props.license}
          onInput={(e) => props.onLicenseChange(e.target.value)}
          placeholder="Immatriculation"
        />
      </div>
      <div class="transporter-vehicles-input">
        <LabeledInputSelect
          defaultValue={0}
          label="Type de vehicule"
          onChange={(e) => props.onTypeChange(e.toString())}
          options={[
            { value: 0, text: "Autocar" },
            { value: 1, text: "Bus" },
          ]}
        />
      </div>
    </div>
  );
}
