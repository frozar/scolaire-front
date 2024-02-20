import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import PlusIcon from "../../../../icons/PlusIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import "./TransporterEditMenuVehicles.css";

export function TransporterEditMenuVehicles() {
  return (
    <div class="transporter-vehicles-content">
      <div class="transporter-vehicles-header">
        <p>Liste des véhicules</p>
        <ButtonIcon
          icon={<PlusIcon />}
          onClick={() => console.log("add vehicle")}
        />
      </div>
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
    </div>
  );
}
