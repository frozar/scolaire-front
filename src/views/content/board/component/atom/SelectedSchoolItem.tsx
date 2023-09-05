import { FaSolidMinus } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { SchoolType } from "../../../../../_entities/school.entity";
import "./SelectedSchoolItem.css";

const [, { removeSchoolToLineUnderConstruction }] = useStateAction();

export default function (props: { school: SchoolType }) {
  const onClick = () => removeSchoolToLineUnderConstruction(props.school);

  return (
    <div class="selected-school-item">
      <p>{props.school.name}</p>
      <FaSolidMinus class="fill-red-600 cursor-pointer" onClick={onClick} />
    </div>
  );
}
