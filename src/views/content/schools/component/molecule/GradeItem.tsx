import { FaRegularTrashCan } from "solid-icons/fa";
import { createEffect, createSignal } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import { GradeService } from "../../../../../_services/grade.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { GradeUtils } from "../../../../../utils/grade.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setOnBoard } from "../../../board/component/template/ContextManager";
import {
  getSchools,
  setSchools,
} from "../../../map/component/organism/SchoolPoints";
import { setSelectedGrade } from "../organism/GradeBoard";
import {
  schoolDetailsItem,
  setSchoolDetailsItem,
} from "../organism/SchoolDetails";
import "./GradeItem.css";

interface GradeItemProps {
  grade: GradeType;
  NbStudents?: number;
}

export default function (props: GradeItemProps) {
  const [isMouseOverTrashCan, setIsMouseOverTrashCan] = createSignal(false);

  createEffect(() => console.log(isMouseOverTrashCan()));

  async function deleteGrade() {
    const gradeId = props.grade?.id;
    if (!gradeId) return false;

    const deletedGradeId = await GradeService.delete(gradeId);
    if (!deletedGradeId) return false;

    if (deletedGradeId) {
      // eslint-disable-next-line solid/reactivity
      setSchools((prev) => {
        return [...prev].map((school) => {
          return {
            ...school,
            grades: school.grades.filter((grade) => grade.id != gradeId),
          };
        });
      });
      const schoolDetailsItemId = schoolDetailsItem()?.id as number;
      setSchoolDetailsItem(
        getSchools().filter((school) => school.id == schoolDetailsItemId)[0]
      );
    }
    return true;
  }

  async function onClickDelete() {
    setRemoveConfirmation({
      textToDisplay: "Êtes-vous sûr de vouloir supprimer la grade : ",
      itemName: props.grade.name,
      validate: deleteGrade,
    });
  }

  function onClick() {
    if (!isMouseOverTrashCan()) {
      setSelectedGrade(props.grade);
      setOnBoard("school-grade-details");
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
