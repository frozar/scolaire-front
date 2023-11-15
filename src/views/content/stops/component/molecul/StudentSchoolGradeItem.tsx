import { Show, createSignal } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { AssociatedUtils } from "../../../../../utils/associated.utils";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { stopDetailsItem } from "../organism/StopDetails";
import EditStudentSchoolGradeItem from "./EditStudentSchoolGradeItem";
import "./StudentSchoolGradeItem.css";

export default function (props: { school: AssociatedSchoolType }) {
  const [editingMode, setEditingMode] = createSignal(false);

  async function onClickDelete() {
    AssociatedUtils.deleteAssociated(props.school.idClassToSchool);
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
              " élèves restants sur " +
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
