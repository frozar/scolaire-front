import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { CheckableEventType } from "../atom/CheckableElement";
import { CheckableElementList } from "../molecule/CheckableElementList";
import { checkableStop, setCheckableStop } from "./AddLineBoardContent";
import "./CollapsibleCheckableElement.css";

export type AssociatedItem = { item: any; done: boolean };

export function CheckableStopListBySchool(props: { school: SchoolType }) {
  return (
    <CheckableElementList
      title={props.school.name}
      content={checkableStop().map((stop) => {
        return {
          name: stop.item.name,
          checked: stop.done,
          onChange: onChangeFunction,
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

const onChangeFunction = (e: CheckableEventType, indice: number) => {
  const prev = [...checkableStop()];
  prev[indice] = { ...prev[indice], done: e.currentTarget.checked };
  setCheckableStop(prev);
};
