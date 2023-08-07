import { PointInformation } from "./Point";
import "./SelectedSchoolItem.css";

export default function (props: { etablissement: PointInformation }) {
  return (
    <div class="selected-school-item">
      <strong>{props.etablissement.name}</strong>
    </div>
  );
}
