import { JSXElement } from "solid-js";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { GradeUtils } from "../../../../../utils/grade.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import {
  changeBoard,
  setOnBoard,
} from "../../../board/component/template/ContextManager";
import { selectedGrade } from "./GradeBoard";

// TODO: Refactor all read board headers css (trip, stop, school, grade)
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import "./GradeBoardDetailsHeader.css";

export function GradeBoardDetailsHeader(): JSXElement {
  async function validate() {
    const success = await GradeUtils.deleteGrade(selectedGrade()?.id as number);
    if (success) {
      changeBoard("school-details");
      return true;
    } else return false;
  }

  function onClick() {
    const gradeId = selectedGrade()?.id as number;

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
      itemName: selectedGrade()?.name as string,
      validate,
    });
  }

  return (
    <header class="grade-detail-header">
      <div class="grade-detail-header-title">
        <p>{selectedGrade()?.name as string}</p>
        <div class="grade-detail-header-buttons">
          <ButtonIcon
            icon={<PencilIcon />}
            onClick={() => setOnBoard("school-grade-modify")}
          />
          <ButtonIcon icon={<TrashIcon />} onClick={onClick} />
        </div>
      </div>

      <p>
        {GradeUtils.getTotalQuantity(selectedGrade()?.id as number) + " élèves"}
      </p>
    </header>
  );
}
