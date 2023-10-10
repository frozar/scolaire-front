import { FaSolidMinus } from "solid-icons/fa";
import { SchoolType } from "../../../../../_entities/school.entity";
import { removeSchoolToRace } from "../organism/DrawModeBoardContent";
import "./SelectedSchoolItem.css";

export default function (props: { school: SchoolType }) {
  const onClick = () => removeSchoolToRace(props.school);

  return (
    <div class="selected-school-item">
      <p>{props.school.name}</p>
      <FaSolidMinus class="fill-red-600 cursor-pointer" onClick={onClick} />
    </div>
  );
}
