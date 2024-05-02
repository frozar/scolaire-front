import { createSignal } from "solid-js";
import { AllotmentCostType } from "../../../../../_entities/allotment.entity";
import { AllotmentAddButtons } from "./AllotmentAddButtons";
import { AllotmentAddHeader } from "./AllotmentAddHeader";
import { AllotmentAddInputs } from "./AllotmentAddInputs";
import "./AllotmentAddMenu.css";
import { AllotmentCostList } from "./AllotmentCostList";

interface AllotmentAddMenuProps {
  defaultName: string;
  defaultColor: string;
  cancel: () => void;
  submit: () => void;
  nameChange: (name: string) => void;
  colorChange: (color: string) => void;
  costchange: (cost: AllotmentCostType[]) => void;
}

export function AllotmentAddMenu(props: AllotmentAddMenuProps) {
  const [costs, setCosts] = createSignal<AllotmentCostType[]>([]);

  function submit() {
    props.costchange(costs());
    props.submit();
  }

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
        <AllotmentCostList costList={costs()} costSetter={setCosts} />
        <AllotmentAddButtons cancel={props.cancel} submit={submit} />
      </div>
    </div>
  );
}
