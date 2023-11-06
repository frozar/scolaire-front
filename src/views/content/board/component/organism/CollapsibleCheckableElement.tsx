import { For } from "solid-js";

import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { CheckableElement } from "../atom/CheckableElement";
import { setStopSelected, stopSelected } from "./AddLineBoardContent";
import "./CollapsibleCheckableElement.css";
import CollapsibleElement from "./CollapsibleElement";

export type AssociatedItem = { stopItem: StopType; done: boolean };

export default function (props: { school: SchoolType }) {
  function gradeInStopAndSchool(stop_elem: StopType) {
    const allGradeIDInSchool = props.school.grades.map(
      (grade) => grade.id
    ) as number[];

    const allClassIdInStop = stop_elem.associated.map(
      (associated_item) => associated_item.gradeId
    );
    const intersectionGrades = allGradeIDInSchool.filter((gradeId) =>
      allClassIdInStop.includes(gradeId)
    );
    return intersectionGrades.length > 0;
  }

  const onChangeFunction = (
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    },
    indice: number
  ) => {
    const prev = [...stopSelected()];
    prev[indice] = { ...prev[indice], done: e.currentTarget.checked };
    setStopSelected(prev);
  };

  type CollapsibleCheckableList = {
    title: string;
    content: CheckableElementType[];
  };

  return (
    <CollapsibleElement title={props.school.name}>
      <For each={stopSelected()}>
        {(stop_elem, i) => {
          return (
            <CheckableElement
              name={stop_elem.stopItem.name}
              checked={stop_elem.done}
              onChange={onChangeFunction}
              indice={i()}
              display={gradeInStopAndSchool(stop_elem.stopItem)}
            />
          );
        }}
      </For>
    </CollapsibleElement>
  );
}
