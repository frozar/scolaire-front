import { Setter } from "solid-js";
import { AllotmentType } from "../../../../_entities/allotment.entity";
import { AllotmentEditHeader } from "../atom/AllotmentEditHeader";
import { AllotmentEditContent } from "./AllotmentEditContent";

interface AllotmentEditMenuProps {
  allotment: AllotmentType;
  allotmentSetter: Setter<AllotmentType>;
  toggleEdit: () => void;
}

export function AllotmentEditMenu(props: AllotmentEditMenuProps) {
  return (
    <div>
      <AllotmentEditHeader title={props.allotment.name} />
      <AllotmentEditContent
        allotment={props.allotment}
        allotmentSetter={props.allotmentSetter}
        toggleMenu={props.toggleEdit}
      />
    </div>
  );
}
