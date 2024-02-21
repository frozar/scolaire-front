import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import "./TransporterEditVehicles.css";

export function TransporterEditVehiclesInputs() {
  return (
    <div class="transporter-vehicles-input-container">
      <div class="transporter-vehicles-input">
        <LabeledInputField
          label="Immatriculation"
          name="license"
          value={""}
          onInput={() => console.log("a")}
          placeholder="Immatriculation"
        />
      </div>
      <div class="transporter-vehicles-input">
        <LabeledInputSelect
          defaultValue={0}
          label="Type de vehicule"
          onChange={() => console.log("")}
          options={[
            { value: 0, text: "Autocar" },
            { value: 1, text: "Bus" },
          ]}
        />
      </div>
    </div>
  );
}
