import { Show, createSignal } from "solid-js";
import {
  ClassStudentToSchool,
  ClassToSchoolTypeFormatedWithUsedQuantity,
} from "../../../../../_entities/student-to-school.entity";
import { StudentToSchoolService } from "../../../../../_services/student-to-school.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { stopDetailsItem } from "../organism/StopDetails";
import EditStudentSchoolClassItem from "./EditStudentSchoolClassItem";
import "./StudentSchoolClassItem.css";

export default function (props: {
  school: ClassToSchoolTypeFormatedWithUsedQuantity;
}) {
  const [editingMode, setEditingMode] = createSignal(false);

  async function onClickDelete() {
    const response = await StudentToSchoolService.delete(props.school.id);
    ClassStudentToSchool.removeFromStop(
      response,
      stopDetailsItem()?.id as number
    );
  }

  function onClickEdit() {
    setEditingMode(true);
  }

  return (
    <Show
      when={!editingMode()}
      fallback={
        <EditStudentSchoolClassItem
          classStudentToSchool={props.school}
          close={() => setEditingMode(false)}
        />
      }
    >
      <CardWrapper class="school-list-item">
        <div class="school-list-item-content">
          <CardTitle title={props.school.school.name} />
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
