import { Accessor, Setter } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { CheckableEventType } from "../atom/CheckableElement";
import {
  AssociatedItem,
  CheckableElementList,
} from "../molecule/CheckableElementList";
import "./CollapsibleCheckableElement.css";

export function CheckableStopListBySchool(props: {
  school: SchoolType;
  checkableStop: Accessor<AssociatedItem[]>;
  setCheckableStop: Setter<AssociatedItem[]>;
}) {
  const onChange = (e: CheckableEventType, indice: number) => {
    const prev = [...props.checkableStop()];
    prev[indice] = { ...prev[indice], done: e.currentTarget.checked };
    props.setCheckableStop(prev);
  };

  return (
    <CheckableElementList
      title={props.school.name}
      content={props.checkableStop().map((stop) => {
        return {
          name: stop.item.name,
          checked: stop.done,
          onChange,
          display: gradeInStopAndSchool(stop.item, props.school.grades),
        };
      })}
    />
  );
}

function gradeInStopAndSchool(stop_elem: StopType, grades: GradeType[]) {
  const allGradeIDInSchool = grades.map((grade) => grade.id) as number[];

  const allClassIdInStop = stop_elem.associated.map(
    (associated_item) => associated_item.gradeId
  );
  const intersectionGrades = allGradeIDInSchool.filter((gradeId) =>
    allClassIdInStop.includes(gradeId)
  );
  return intersectionGrades.length > 0;
}
