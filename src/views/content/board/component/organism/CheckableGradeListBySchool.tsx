import { Accessor, Setter } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { CheckableEventType } from "../atom/CheckableElement";
import {
  AssociatedItem,
  CheckableElementList,
} from "../molecule/CheckableElementList";
import "./CollapsibleCheckableElement.css";

export function CheckableGradeListBySchool(props: {
  school: SchoolType;
  checkableGrade: Accessor<AssociatedItem[]>;
  setCheckableGrade: Setter<AssociatedItem[]>;
}) {
  const onChangeFunction = (e: CheckableEventType, indice: number) => {
    const prev = [...props.checkableGrade()];
    prev[indice] = { ...prev[indice], done: e.currentTarget.checked };
    props.setCheckableGrade(prev);
  };

  return (
    <CheckableElementList
      title={props.school.name}
      content={props.checkableGrade().map((grade) => {
        return {
          name: grade.item.name,
          checked: grade.done ?? false,
          onChange: onChangeFunction,
          display: props.school.grades
            .map((gradeMap) => gradeMap.id)
            .includes(grade.item.id),
        };
      })}
    />
  );
}
