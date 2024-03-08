import { createSignal } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import TrashIcon from "../../../../../icons/TrashIcon";
import { SchoolUtils } from "../../../../../utils/school.utils";
import { ViewManager } from "../../../ViewManager";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import GradeLinkedSchool from "../../../schools/component/atom/GradeLinkedSchool";
import "./StopItem.css";

interface StopItemProps {
  stop: StopType;
}

export default function (props: StopItemProps) {
  const schoolNames = () =>
    props.stop.associated.map((gradeToSchool) =>
      SchoolUtils.getName(gradeToSchool.schoolId)
    );

  const [refTrashButton, setRefTrashButton] = createSignal<HTMLButtonElement>();

  const onClickDelete = () => {
    console.log("Delete stop");
  };

  const onClickEdit = () => {
    ViewManager.stopDetails(props.stop);
  };

  return (
    <CardWrapper
      class="stop-item"
      onClick={onClickEdit}
      refClickableButtons={[refTrashButton]}
    >
      <div class="stop-item-content">
        <CardTitle title={props.stop.name} />
        <GradeLinkedSchool schools={schoolNames()} />
      </div>

      <div class="stop-item-actions">
        <ButtonIcon
          refSetter={setRefTrashButton}
          icon={<TrashIcon />}
          onClick={onClickDelete}
          disable={true}
        />
      </div>
    </CardWrapper>
  );
}
