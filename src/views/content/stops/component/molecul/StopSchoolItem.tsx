import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./StopSchoolItem.css";

export default function (props: { school: AssociatedPointType }) {
  function onClickDelete() {
    console.log("delete school");
  }

  function onClickEdit() {
    console.log("edit school");
  }

  return (
    <CardWrapper class="school-list-item">
      <div class="school-list-item-content">
        <CardTitle title={props.school.name} />
        <p>{props.school.quantity + " élèves à récuperer"}</p>
      </div>

      <div class="school-list-item-actions">
        <ButtonIcon icon={<TrashIcon />} onClick={onClickDelete} />
        <ButtonIcon icon={<PencilIcon />} onClick={onClickEdit} />
      </div>
    </CardWrapper>
  );
}