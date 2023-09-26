import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setSchoolDetailsItem } from "../organism/SchoolDetails";
import "./SchoolItem.css";

export interface SchoolItemProps {
  school: SchoolType;
}

export default function (props: SchoolItemProps) {
  async function onClickDelete() {
    // TODO: stanby
    // const response = await SchoolService.delete(props.school.id);
    // console.log(response);
  }

  async function onClickEdit() {
    // TODO: setup board manager for school
    setSchoolDetailsItem(props.school);
    changeBoard("school-details");
  }

  return (
    <CardWrapper>
      <div class="school-item-head">
        <CardTitle title={props.school.name} />
        <div class="school-item-actions">
          <ButtonIcon
            icon={<FaRegularTrashCan class="fill-red-base" />}
            onClick={onClickDelete}
          />
          <ButtonIcon
            icon={<FaSolidPen class="fill-green-base" />}
            onClick={onClickEdit}
          />
        </div>
      </div>
      <div class="school-item-content">
        <p>lignes: {SchoolEntity.getSchoolLines(props.school.id).length}</p>
        <p>classes: {props.school.classes.length}</p>
        <p>élèves: {SchoolEntity.getStudentQuantityForSchool(props.school)}</p>
      </div>
    </CardWrapper>
  );
}
