import { For, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../_entities/school.entity";
import { getSchools } from "../../../../_stores/school.store";
import { setSchoolPointOnClick } from "../../_component/molecule/SchoolPoint";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import BoardTitle from "../../board/component/atom/BoardTitle";
import BoardFooterActions from "../../board/component/molecule/BoardFooterActions";
import { SelectSchoolItem } from "../molecule/SelectSchoolItem";

export function SelectSchoolsStep(props: {
  schools: SchoolType[];
  previousStep: () => void;
  nextStep: () => void;
  onUpdate: (schools: SchoolType[]) => void;
}) {
  onMount(() => {
    setDisplaySchools(getSchools());
    setSchoolPointOnClick(() => schoolOnClick);
  });
  onCleanup(() => {
    setDisplaySchools([]);
    setSchoolPointOnClick();
  });

  function schoolOnClick(schoolToAdd: SchoolType) {
    const schools = [...props.schools];
    let index: number | undefined = undefined;
    for (const schoolIndex in schools) {
      if (schools[schoolIndex].id == schoolToAdd.id) {
        index = Number(schoolIndex);
      }
    }
    if (index == undefined) {
      schools.push(schoolToAdd);
    } else {
      schools.splice(index, 1);
    }
    props.onUpdate(schools);
  }

  function onRemove(index: number) {
    const schools = [...props.schools];
    schools.splice(index, 1);
    props.onUpdate(schools);
  }

  return (
    <>
      <BoardTitle title="Sélection des écoles" />
      <div class="selected-school">
        <For each={props.schools}>
          {(school, i) => (
            <SelectSchoolItem school={school} onRemove={() => onRemove(i())} />
          )}
        </For>
      </div>
      <BoardFooterActions
        nextStep={{
          callback: props.nextStep,
          label: "Suivant",
          disable: props.schools.length == 0,
        }}
        previousStep={{
          callback: props.previousStep,
          label: "Annuler",
        }}
      />
    </>
  );
}
