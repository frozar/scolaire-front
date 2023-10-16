import { createSignal } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../../icons/TrashIcon";
import { updatePointColor } from "../../../../../leafletUtils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import ClasseLinkedSchool from "../../../schools/component/atom/ClasseLinkedSchool";
import { setStopDetailsItem } from "../organism/StopDetails";
import "./StopItem.css";

interface StopItemProps {
  stop: StopType;
}

export default function (props: StopItemProps) {
  const schoolNames = () =>
    props.stop.associated.map((classToSchool) => classToSchool.name);
  const [refTrashButton, setRefTrashButton] = createSignal<HTMLButtonElement>();

  const onClickDelete = () => {
    console.log("Delete stop");
  };

  const onClickEdit = () => {
    setStopDetailsItem(props.stop);
    changeBoard("stop-details");
    updatePointColor(props.stop);
  };

  return (
    <CardWrapper
      class="stop-item"
      onClick={onClickEdit}
      refClickableButtons={[refTrashButton]}
    >
      <div class="stop-item-content">
        <CardTitle title={props.stop.name} />
        <ClasseLinkedSchool schools={schoolNames()} />
      </div>

      <div class="stop-item-actions">
        <ButtonIcon
          refSetter={setRefTrashButton}
          icon={<TrashIcon />}
          onClick={onClickDelete}
        />
      </div>
    </CardWrapper>
  );
}
