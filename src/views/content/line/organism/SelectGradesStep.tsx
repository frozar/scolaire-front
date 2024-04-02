import { For, createEffect, createSignal, onMount } from "solid-js";
import { GradeType } from "../../../../_entities/grade.entity";
import { SchoolType } from "../../../../_entities/school.entity";
import BoardFooterActions from "../../board/component/molecule/BoardFooterActions";
import { CheckableElementList } from "../molecule/CheckableElementList";

export function SelectGradesStep(props: {
  schools: SchoolType[];
  grades: GradeType[];
  previousStep: () => void;
  nextStep: () => void;
  onUpdate: (grades: GradeType[]) => void;
}) {
  const [localGradesId, setLocalGradesId] = createSignal<number[]>([]);
  onMount(() => {
    setGradesId(props.grades);
  });
  createEffect(() => {
    setGradesId(props.grades);
  });

  function setGradesId(grades: GradeType[]) {
    setLocalGradesId(grades.map((grade) => grade.id ?? -1));
  }

  function onUpdateGrade(grade: GradeType): void {
    const grades = [...props.grades];
    let index: number | undefined = undefined;
    for (const gradeIndex in grades) {
      if (grades[gradeIndex].id == grade.id) {
        index = Number(gradeIndex);
      }
    }
    if (index == undefined) {
      grades.push(grade);
    } else {
      grades.splice(index, 1);
    }
    props.onUpdate(grades);
  }

  return (
    <>
      <div class="select-grades">
        <For each={props.schools}>
          {(school) => {
            return (
              <CheckableElementList
                title={school.name}
                displayQuantity={false}
                elements={school.grades.map((grade) => {
                  return {
                    name: grade.name,
                    id: grade.id ?? -1,
                    checked: localGradesId().includes(grade.id ?? -1),
                    onChange: () => onUpdateGrade(grade),
                    //TODO disabled si quantité = 0
                    //TODO afficher quantité
                  };
                })}
              />
            );
          }}
        </For>
      </div>
      <BoardFooterActions
        nextStep={{
          callback: props.nextStep,
          label: "Suivant",
          disable: localGradesId().length == 0,
        }}
        previousStep={{
          callback: props.previousStep,
          label: "Précédent",
        }}
      />
    </>
  );
}
