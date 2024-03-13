import { JSXElement } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { GradeUtils } from "../../../../../utils/grade.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";

// TODO: Refactor all read board headers css (trip, stop, school, grade)
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { ViewManager } from "../../../ViewManager";
import "./GradeBoardDetailsHeader.css";

export function GradeBoardDetailsHeader(props: {
  grade: GradeType;
}): JSXElement {
  async function validate() {
    const success = await GradeUtils.deleteGrade(props.grade.id as number);
    if (success) {
      // TODO refacto with ViewManager.schoolDetails(school);
      changeBoard("school-details");
      return true;
    } else return false;
  }

  function onRemove() {
    const gradeId = props.grade.id as number;

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
      itemName: props.grade.name as string,
      validate,
    });
  }

  return (
    <header class="grade-detail-header">
      <div class="grade-detail-header-title">
        <p>{props.grade.name as string}</p>
        <div class="grade-detail-header-buttons">
          <ButtonIcon
            icon={<PencilIcon />}
            onClick={() => ViewManager.schoolGradeEdit(props.grade)}
          />
          <ButtonIcon icon={<TrashIcon />} onClick={onRemove} />
        </div>
      </div>

      <p>{GradeUtils.getTotalQuantity(props.grade.id as number) + " élèves"}</p>
    </header>
  );
}
