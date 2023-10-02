import { FaRegularTrashCan } from "solid-icons/fa";
import { Accessor, createSignal } from "solid-js";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { updatePointColor } from "../../../../../leafletUtils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../organism/SchoolDetails";
import "./SchoolItem.css";

export interface SchoolItemProps {
  school: SchoolType;
}

export default function (props: SchoolItemProps) {
  const [refTrashButton, setRefTrashButton] = createSignal<HTMLButtonElement>();

  async function onClickDelete() {
    console.log("delete");
    // TODO: standby
    // const response = await SchoolService.delete(props.school.id);
    // console.log(response);
  }

  async function onClickEdit() {
    // TODO: setup board manager for school
    setSchoolDetailsItem(props.school);
    changeBoard("school-details");
    updatePointColor(props.school);
  }

  return (
    <CardWrapper
      onClick={onClickEdit}
      class="z-10"
      refClickableButtons={[refTrashButton] as Accessor<HTMLButtonElement>[]}
    >
      <div class="school-item-head">
        <CardTitle title={props.school.name} />
        <div class="school-item-actions">
          <ButtonIcon
            refSetter={setRefTrashButton}
            icon={<FaRegularTrashCan class="fill-red-base" />}
            onClick={onClickDelete}
          />
        </div>
      </div>
      <div class="school-item-content">
        <p>lignes: {SchoolEntity.getSchoolCourses(props.school.id).length}</p>
        <p>classes: {props.school.classes.length}</p>
        <p>élèves: {SchoolEntity.getStudentQuantityForSchool(props.school)}</p>
      </div>
    </CardWrapper>
  );
}
