import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { getBus } from "../../bus/organism/Bus";
import "./TransporterEditVehicles.css";

interface TransporterEditVehiclesInputsProps {
  license: string;
  bus_id?: number;
  index: number;
  onLicenseChange: (idx: number, value: string) => void;
  onTypeChange: (idx: number, value: number) => void;
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
          onInput={(e) => props.onLicenseChange(props.index, e.target.value)}
          placeholder="Immatriculation"
        />
      </div>
      <div class="transporter-vehicles-input">
        <LabeledInputSelect
          variant="borderless"
          defaultValue={Number(props.bus_id)}
          label="Véhicule associé"
          onChange={(e) => props.onTypeChange(props.index, Number(e))}
          options={getBus().map((bus) => {
            return { value: Number(bus.id), text: bus.name };
          })}
        />
      </div>
    </div>
  );
}
