import { FaRegularTrashCan, FaSolidPen } from "solid-icons/fa";
import { SchoolType } from "../../../../../_entities/school.entity";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getBusLines } from "../../../map/component/organism/BusLines";
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

  // TODO used at 2 place, to refactor: SchoolDetails.tsx
  function getSchoolLines() {
    const lines = [];

    for (const line of getBusLines()) {
      const _line = line.schools.filter((l) => l.id == props.school.id);
      if (_line.length > 0) lines.push(line);
    }

    return lines;
  }

  // TODO used at 2 place, to refactor: SchoolDetailsHeader.tsx
  function studentQuantity() {
    let quantity = 0;
    for (const stop of props.school.associated) {
      quantity += stop.quantity;
    }
    return quantity;
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
        <p>lignes: {getSchoolLines().length}</p>
        <p>classes: {props.school.classes.length}</p>
        <p>élèves: {studentQuantity()}</p>
      </div>
    </div>
  );
}
