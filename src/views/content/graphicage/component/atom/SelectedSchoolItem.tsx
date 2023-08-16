import { SchoolType } from "../../../../../_entities/school.entity";
import "./SelectedSchoolItem.css";

export default function (props: { etablissement: SchoolType }) {
  return (
    <div class="selected-school-item">
      <strong>{props.etablissement.name}</strong>
    </div>
  );
}
