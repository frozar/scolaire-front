import { LeafletSchoolType } from "../organism/PointsEtablissement";
import "./SelectedSchoolItem.css";

export default function (props: { etablissement: LeafletSchoolType }) {
  return (
    <div class="selected-school-item">
      <strong>{props.etablissement.name}</strong>
    </div>
  );
}
