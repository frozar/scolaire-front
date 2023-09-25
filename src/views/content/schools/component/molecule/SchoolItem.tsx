import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { SchoolType } from "../../../../../_entities/school.entity";
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
    <div class="school-item">
      <div class="school-item-head">
        <p>{props.school.name}</p>
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
        <p>lignes: Todo</p>
        <p>classes: Todo</p>
        <p>élèves: Todo</p>
      </div>
    </div>
  );
}
