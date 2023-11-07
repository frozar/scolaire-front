import { Show, createSignal } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { StudentToGradeService } from "../../../../../_services/student-to-grade.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { removeFromStop } from "../../../map/component/organism/StopPoints";
import { stopDetailsItem } from "../organism/StopDetails";
import EditStudentSchoolGradeItem from "./EditStudentSchoolGradeItem";
import "./StudentSchoolGradeItem.css";

export default function (props: { school: AssociatedSchoolType }) {
  const [editingMode, setEditingMode] = createSignal(false);

  async function onClickDelete() {
    const response = await StudentToGradeService.delete(
      props.school.idClassToSchool
    );
    console.log("delete class to school response", response);

    removeFromStop(response, stopDetailsItem()?.id as number);
  }

  function onClickEdit() {
    setEditingMode(true);
  }

  return (
    <Show
      when={!editingMode()}
      fallback={
        <EditStudentSchoolGradeItem
          gradeStudentToGrade={props.school}
          close={() => setEditingMode(false)}
        />
      }
    >
      <CardWrapper class="school-list-item">
        <div class="school-list-item-content">
          <CardTitle title={GradeUtils.getName(props.school.gradeId)} />
          <p class="school-list-item-quantity">
            {/* TODO: Lucas fix remaining with new type */}
            {QuantityUtils.remainingStudentToGradeQuantity(
              props.school,
              stopDetailsItem()?.id as number
            ) +
              " élèves restant sur " +
              props.school.quantity}
          </p>
        </div>

        <div class="school-list-item-actions">
          <ButtonIcon icon={<TrashIcon />} onClick={onClickDelete} />
          <ButtonIcon icon={<PencilIcon />} onClick={onClickEdit} />
        </div>
      </CardWrapper>
    </Show>
  );
}
