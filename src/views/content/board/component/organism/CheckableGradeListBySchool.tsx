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
  displayQuantity: boolean;
}) {
  const onChangeFunction = (e: CheckableEventType, indice: number) => {
    const prev = [...props.checkableGrade()];
    prev[indice] = { ...prev[indice], done: e.currentTarget.checked };
    props.setCheckableGrade(prev);
  };

  // ! Remettre comme c'etait avant !
  // const onChangeFunction = (checked: boolean, indice: number) => {
  //   const prev = [...props.checkableGrade()];
  //   prev[indice] = { ...prev[indice], done: checked };
  //   props.setCheckableGrade(prev);
  // };
  return (
    <CheckableElementList
      title={props.school.name}
      displayQuantity={props.displayQuantity}
      content={props.checkableGrade().map((grade) => {
        return {
          name: grade.item.name,
          id: grade.item.id,
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
