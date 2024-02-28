import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import { getBus } from "../../bus/organism/Bus";
import "./TransporterAddMenu.css";

interface TransporterAddvehicleProps {
  license: string;
  busId: number;
  index: number;
  licenseChange: (id: number, value: string) => void;
  typeChange: (id: number, value: number) => void;
}

export function TransporterAddvehicle(props: TransporterAddvehicleProps) {
  return (
    <div class="transporter-add-vehicle-input">
      <div class="transporter-add-vehicle-input-field">
        <LabeledInputField
          label="Immatriculation"
          name="license"
          value={props.license}
          onInput={(e) => props.licenseChange(props.index, e.target.value)}
          placeholder="Immatriculation"
        />
      </div>
      <div class="transporter-add-vehicle-input-field">
        <LabeledInputSelect
          variant="borderless"
          defaultValue={props.busId}
          label="Véhicule associé"
          onChange={(e) => props.typeChange(props.index, Number(e))}
          options={getBus().map((bus) => {
            return { value: Number(bus.id), text: bus.name };
          })}
        />
      </div>
    </div>
  );
}
