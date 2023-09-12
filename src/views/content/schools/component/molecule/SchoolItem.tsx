import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { SchoolType } from "../../../../../_entities/school.entity";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
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
        {/* TODO check how get these varaibles NbLines, NbClasses, NbStudents*/}
        {/* <p>lignes: {props.school.NbLines ?? 0}</p>
        <p>classes: {props.school.NbClasses ?? 0}</p>
        <p>élèves: {props.school.NbStudents ?? 0}</p> */}
        <p>lignes: 0</p>
        <p>classes: 0</p>
        <p>élèves: 0</p>
      </div>
    </div>
  );
}
