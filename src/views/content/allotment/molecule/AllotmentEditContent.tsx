import { Setter, createSignal, onMount } from "solid-js";
import {
  AllotmentCostType,
  AllotmentType,
} from "../../../../_entities/allotment.entity";
import { CircleCheckIcon } from "../../../../icons/CircleCheckIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import { AllotmentCostList } from "../../market/molecule/allotment/AllotmentCostList";
import { TransporterList } from "../../market/molecule/allotment/TransporterList";
import "./AllotmentEditContent.css";
import { AllotmentEditInputs } from "./AllotmentEditInputs";

interface AllotmentEditContentProps {
  allotment: AllotmentType;
  allotmentSetter: Setter<AllotmentType>;
  toggleMenu: () => void;
}

export function AllotmentEditContent(props: AllotmentEditContentProps) {
  const [costs, setCosts] = createSignal<AllotmentCostType[]>([]);

  onMount(() => {
    setCosts(props.allotment.vehicleCost);
  });

  function onNameChange(value: string) {
    props.allotmentSetter((prev) => {
      return { ...prev, name: value };
    });
  }

  function onColorChange(value: string) {
    props.allotmentSetter((prev) => {
      return { ...prev, color: value };
    });
  }

  function confirm() {
    // eslint-disable-next-line solid/reactivity
    props.allotmentSetter((prev) => {
      return { ...prev, vehicleCost: costs() };
    });
    props.toggleMenu();
  }

  return (
    <div class="allotment-edit-border">
      <AllotmentEditInputs
        color={props.allotment.color}
        name={props.allotment.name}
        onColorInput={onColorChange}
        onNameInput={onNameChange}
      />
      <div class="allotment-edit-cost">
        <AllotmentCostList costList={costs()} costSetter={setCosts} />
      </div>
      <div class="allotment-edit-transporter">
        <TransporterList allotmentId={props.allotment.id as number} />
      </div>
      <div class="allotment-edit-buttons">
        <ButtonIcon icon={<CircleCheckIcon />} onClick={confirm} />
      </div>
      {/* <TransporterTable allotment_id={props.allotment.id} /> */}
    </div>
  );
}
