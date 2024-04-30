import { Setter } from "solid-js";
import { AllotmentType } from "../../../../_stores/allotment.store";
import { CircleCheckIcon } from "../../../../icons/CircleCheckIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./AllotmentEditContent.css";
import { AllotmentEditInputs } from "./AllotmentEditInputs";

interface AllotmentEditContentProps {
  allotment: AllotmentType;
  allotmentSetter: Setter<AllotmentType>;
  toggleMenu: () => void;
}

export function AllotmentEditContent(props: AllotmentEditContentProps) {
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

  return (
    <div class="allotment-edit-border">
      <AllotmentEditInputs
        color={props.allotment.color}
        name={props.allotment.name}
        onColorInput={onColorChange}
        onNameInput={onNameChange}
      />
      <div class="allotment-edit-buttons">
        <ButtonIcon icon={<CircleCheckIcon />} onClick={props.toggleMenu} />
      </div>
      {/* <TransporterTable allotment_id={props.allotment.id} /> */}
    </div>
  );
}
