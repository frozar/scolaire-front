import { StopType } from "../../../../../_entities/stop.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import ClasseLinkedSchool from "../../../schools/component/atom/ClasseLinkedSchool";
import "./StopItem.css";

interface StopItemProps {
  stop: StopType;
}

export default function (props: StopItemProps) {
  const schoolNames = () => props.stop.associated.map((school) => school.name);

  const onClickDelete = () => {
    console.log("Delete stop");
  };
  const onClickEdit = () => {
    console.log("Edit stop");
  };

  return (
    <div class="stop-item">
      <div class="stop-item-content">
        <p>{props.stop.name}</p>
        <ClasseLinkedSchool schools={schoolNames()} />
      </div>

      <div class="stop-item-actions">
        <ButtonIcon icon={<TrashIcon />} onClick={onClickDelete} />
        <ButtonIcon icon={<PencilIcon />} onClick={onClickEdit} />
      </div>
    </div>
  );
}
