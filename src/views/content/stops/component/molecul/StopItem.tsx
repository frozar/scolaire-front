import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { StopType } from "../../../../../_entities/stop.entity";
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
      <div class="stop-item-left">
        <p>{props.stop.name}</p>
        <ClasseLinkedSchool schools={schoolNames()} />
      </div>

      <div class="stop-item-right">
        <ButtonIcon
          icon={<FaRegularTrashCan class="fill-red-base" />}
          onClick={onClickDelete}
        />
        <ButtonIcon
          icon={<FaSolidPen class="fill-green-base" />}
          onClick={onClickEdit}
        />
      </div>
    </div>
  );
}
