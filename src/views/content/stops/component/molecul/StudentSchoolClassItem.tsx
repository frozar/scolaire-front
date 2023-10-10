import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import { StudentToSchoolService } from "../../../../../_services/student-to-school.service";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { QuantityUtils } from "../../../../../utils/quantity.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import "./StudentSchoolClassItem.css";

export default function (props: {
  school: AssociatedPointType;
  removeClassStudentToSchoolItem: (id: number) => void;
}) {
  async function onClickDelete() {
    const response = await StudentToSchoolService.delete(
      props.school.studentSchoolId
    );
    props.removeClassStudentToSchoolItem(response);
  }

  function onClickEdit() {
    console.log("edit school");
  }

  return (
    <CardWrapper class="school-list-item">
      <div class="school-list-item-content">
        <CardTitle title={props.school.name} />
        <p class="school-list-item-quantity">
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
  );
}
