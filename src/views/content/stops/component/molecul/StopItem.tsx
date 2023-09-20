import { StopType } from "../../../../../_entities/stop.entity";
import Pencil from "../../../../../icons/Pencil";
import Trash from "../../../../../icons/Trash";
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
        <ButtonIcon icon={<Trash />} onClick={onClickDelete} />
        <ButtonIcon icon={<Pencil />} onClick={onClickEdit} />
      </div>
    </div>
  );
}
