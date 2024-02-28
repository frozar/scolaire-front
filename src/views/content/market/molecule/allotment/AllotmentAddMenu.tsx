import { AllotmentAddButtons } from "./AllotmentAddButtons";
import { AllotmentAddHeader } from "./AllotmentAddHeader";
import { AllotmentAddInputs } from "./AllotmentAddInputs";

interface AllotmentAddMenuProps {
  defaultName: string;
  defaultColor: string;
  cancel: () => void;
  submit: () => void;
  nameChange: (name: string) => void;
  colorChange: (color: string) => void;
}

export function AllotmentAddMenu(props: AllotmentAddMenuProps) {
  return (
    <div>
      <AllotmentAddHeader />
      <div class="allotment-add-border">
        <AllotmentAddInputs
          defaultColor={props.defaultColor}
          defaultName={props.defaultName}
          colorChange={props.colorChange}
          nameChange={props.nameChange}
        />
        <AllotmentAddButtons cancel={props.cancel} submit={props.submit} />
      </div>
    </div>
  );
}
