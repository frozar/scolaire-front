import { Show, createSignal } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { StudentToSchoolService } from "../../../../../_services/student-to-school.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { removeFromStop } from "../../../map/component/organism/StopPoints";
import { stopDetailsItem } from "../organism/StopDetails";
import EditStudentSchoolGradeItem from "./EditStudentSchoolGradeItem";
import "./StudentSchoolGradeItem.css";

export default function (props: { school: AssociatedSchoolType }) {
  const [editingMode, setEditingMode] = createSignal(false);

  async function onClickDelete() {
    const response = await StudentToSchoolService.delete(
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
          gradeStudentToSchool={props.school}
          close={() => setEditingMode(false)}
        />
      }
    >
      <CardWrapper class="school-list-item">
        <div class="school-list-item-content">
          <CardTitle title={props.school.schoolName} />
          <p class="school-list-item-quantity">
            {/* TODO: Lucas fix remaining with new type */}
            {QuantityUtils.remaining(props.school) +
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
