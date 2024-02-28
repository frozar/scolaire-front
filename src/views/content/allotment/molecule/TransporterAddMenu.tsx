import { TransporterAddButtons } from "./TransporterAddButtons";
import { TransporterAddHeader } from "./TransporterAddHeader";
import { TransporterAddInputs } from "./TransporterAddInputs";
import "./TransporterAddMenu.css";

interface TransporterAddMenuProps {
  name: string;
  type: string;
  nameChange: (name: string) => void;
  typeChange: (type: string) => void;
  cancel: () => void;
  submit: () => void;
}

export function TransporterAddMenu(props: TransporterAddMenuProps) {
  return (
    <div>
      <TransporterAddHeader />
      <div class="transporter-add-border">
        <TransporterAddInputs
          name={props.name}
          nameChange={props.nameChange}
          type={props.type}
          typeChange={props.typeChange}
        />
        <TransporterAddButtons submit={props.submit} cancel={props.cancel} />
      </div>
    </div>
  );
}
