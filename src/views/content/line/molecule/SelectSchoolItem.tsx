import { FaSolidMinus } from "solid-icons/fa";
import { SchoolType } from "../../../../_entities/school.entity";
import "./SelectSchoolItem.css";

export function SelectSchoolItem(props: {
  school: SchoolType;
  onRemove: () => void;
}) {
  return (
    <div class="selected-school-item">
      <p>{props.school.name}</p>
      <FaSolidMinus
        class="fill-red-600 cursor-pointer"
        onClick={props.onRemove}
      />
    </div>
  );
}
