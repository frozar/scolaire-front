import { Show, createSignal } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { AssociatedUtils } from "../../../../../utils/associated.utils";
import { GradeUtils } from "../../../../../utils/grade.utils";
import {
  QuantityMatrixType,
  QuantityUtils,
} from "../../../../../utils/quantity.utils";
import { StopUtils } from "../../../../../utils/stop.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { QuantityTable } from "../organism/QuantityTable";
import { stopDetailsItem } from "../organism/StopDetails";
import EditStudentSchoolGradeItem from "./EditStudentSchoolGradeItem";
import "./StudentSchoolGradeItem.css";

// TODO move to organism
export default function (props: { school: AssociatedSchoolType }) {
  const [editingMode, setEditingMode] = createSignal(false);
  const orignalMatrix =
    // eslint-disable-next-line solid/reactivity
    props.school.quantityMatrix as QuantityMatrixType;

  const tripMatrix: QuantityMatrixType[] = StopUtils.getGradeTrips(
    stopDetailsItem()?.id as number
  )
    // eslint-disable-next-line solid/reactivity
    .filter((item) => item.gradeId == props.school.gradeId)
    .flatMap((item) => item.matrix) as QuantityMatrixType[];

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
            {"Total d'élèves: " + props.school.quantity}
          </p>

          <CollapsibleElement title="Quantités restantes">
            <QuantityTable
              matrix={QuantityUtils.calculateMatrix(
                orignalMatrix,
                tripMatrix[0]
              )}
            />
          </CollapsibleElement>
        </div>

        <div class="school-list-item-actions">
          <ButtonIcon icon={<TrashIcon />} onClick={onClickDelete} />
          <ButtonIcon icon={<PencilIcon />} onClick={onClickEdit} />
        </div>
      </CardWrapper>
    </Show>
  );
}
