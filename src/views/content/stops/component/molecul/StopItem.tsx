import { StopType } from "../../../../../_entities/stop.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import ClasseLinkedSchool from "../../../schools/component/atom/ClasseLinkedSchool";
import { setStopDetailsItem } from "../organism/StopDetails";
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
    setStopDetailsItem(props.stop);
    changeBoard("stop-details");
  };

  return (
    <CardWrapper class="stop-item">
      <div class="stop-item-content">
        <CardTitle title={props.stop.name} />
        <ClasseLinkedSchool schools={schoolNames()} />
      </div>

      <div class="stop-item-actions">
        <ButtonIcon icon={<TrashIcon />} onClick={onClickDelete} />
        <ButtonIcon icon={<PencilIcon />} onClick={onClickEdit} />
      </div>
    </CardWrapper>
  );
}
