import _ from "lodash";
import { For, createEffect, createSignal, on } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import StudentSchoolGradeItem from "../molecul/StudentSchoolGradeItem";
import { stopDetails } from "../template/StopDetails";

type GroupedAssociations = {
  [schoolId: string]: AssociatedSchoolType[];
};

export function StudentSchoolGradeList() {
  const [groupedAssociations, setGroupedAssociations] =
    createSignal<GroupedAssociations>();

  createEffect(on(stopDetails, () => associatedSchools()));

  function associatedSchools() {
    setGroupedAssociations(_.groupBy(stopDetails()?.associated, "schoolId"));
  }

  createEffect(() => console.log(groupedAssociations()));
  return (
    <For each={_.keys(groupedAssociations())}>
      {(schoolId) => (
        <CollapsibleElement title={SchoolUtils.getName(Number(schoolId))}>
          <For each={groupedAssociations()?.[schoolId]}>
            {(associatedSchool) => (
              <StudentSchoolGradeItem school={associatedSchool} />
            )}
          </For>
        </CollapsibleElement>
      )}
    </For>
  );
}
