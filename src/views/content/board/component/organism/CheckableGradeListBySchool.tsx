import { SchoolType } from "../../../../../_entities/school.entity";
import { CheckableEventType } from "../atom/CheckableElement";
import { CheckableElementList } from "../molecule/CheckableElementList";
import { checkableStop, setCheckableStop } from "./AddLineBoardContent";
import "./CollapsibleCheckableElement.css";

export function CheckableGradeListBySchool(props: { school: SchoolType }) {
  return (
    <CheckableElementList
      title={props.school.name}
      content={props.school.grades.map((grade) => {
        return {
          name: grade.name,
          checked: grade.done ?? false,
          onChange: onChangeFunction,
          display: true,
        };
      })}
    />
  );
}

const onChangeFunction = (e: CheckableEventType, indice: number) => {
  const prev = [...checkableStop()];
  prev[indice] = { ...prev[indice], done: e.currentTarget.checked };
  setCheckableStop(prev);
};
