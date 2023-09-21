import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./SchoolItem.css";

export default function (props: { school: AssociatedPointType }) {
  function onClickDelete() {
    console.log("delete school");
  }

  function onClickEdit() {
    console.log("edit school");
  }

  return (
    <div class="school-list-item">
      <div class="school-list-item-content">
        <p>{props.school.name}</p>
        <p>{props.school.quantity + " élèves à récuperer"}</p>
      </div>

      <div class="school-list-item-actions">
        <ButtonIcon icon={<TrashIcon />} onClick={onClickDelete} />
        <ButtonIcon icon={<PencilIcon />} onClick={onClickEdit} />
      </div>
    </div>
  );
}
