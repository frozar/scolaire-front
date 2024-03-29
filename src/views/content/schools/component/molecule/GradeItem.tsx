import { FaRegularTrashCan } from "solid-icons/fa";
import { createSignal } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { ViewManager } from "../../../ViewManager";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./GradeItem.css";

interface GradeItemProps {
  grade: GradeType;
  NbStudents?: number;
}

export default function (props: GradeItemProps) {
  const [isMouseOverTrashCan, setIsMouseOverTrashCan] = createSignal(false);

  async function onClickDelete() {
    const gradeId = props.grade?.id;
    if (!gradeId) return;

    if (GradeUtils.checkIfIsUsed(gradeId)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Cette classe ne peut pas être supprimée car elle est liée à " +
          GradeUtils.getTotalQuantity(gradeId) +
          " élèves",
      });
      return;
    }

    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la classe : ",
      itemName: props.grade.name,
      validate: () => GradeUtils.deleteGrade(gradeId),
    });
  }

  function onClick() {
    if (!isMouseOverTrashCan()) {
      ViewManager.schoolGrade(props.grade);
    }
  }

  return (
    <CardWrapper class="grade-item" onClick={onClick}>
      <div class="left">
        <CardTitle title={props.grade.name} />
        <p>
          {GradeUtils.getTotalQuantity(props.grade.id as number) +
            " élèves au total "}
        </p>
      </div>

      <div
        class="grade-item-actions"
        onMouseEnter={() => setIsMouseOverTrashCan(true)}
        onMouseLeave={() => setIsMouseOverTrashCan(false)}
      >
        <ButtonIcon
          icon={<FaRegularTrashCan class="fill-red-base" />}
          onClick={onClickDelete}
        />
      </div>
    </CardWrapper>
  );
}
