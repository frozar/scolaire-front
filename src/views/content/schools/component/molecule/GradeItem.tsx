import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { GradeType } from "../../../../../_entities/grade.entity";
import { GradeService } from "../../../../../_services/grade.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { setRemoveConfirmation } from "../../../../../userInformation/RemoveConfirmation";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
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
  function onClickEdit() {
    setSelectedGrade(props.grade);
    changeBoard("school-grade-modify");
  }

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
  return (
    <CardWrapper class="grade-item">
      <div class="left">
        <CardTitle title={props.grade.name} />
        <p>
          {QuantityUtils.remainingGradeQuantity(props.grade.id as number) +
            " élèves restants sur " +
            QuantityUtils.totalGradeQuantity(props.grade.id as number)}
        </p>
      </div>

      <div class="grade-item-actions">
        <ButtonIcon
          icon={<FaRegularTrashCan class="fill-red-base" />}
          onClick={onClickDelete}
        />
        <ButtonIcon
          icon={<FaSolidPen class="fill-green-base" />}
          onClick={onClickEdit}
        />
      </div>
    </CardWrapper>
  );
}
