import _ from "lodash";
import { For, createEffect, createSignal, on } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import StudentSchoolGradeItem from "../molecul/StudentSchoolGradeItem";
import { stopDetailsItem } from "./StopDetails";

type GroupedAssociations = {
  [schoolId: string]: AssociatedSchoolType[];
};

export default function () {
  const [groupedAssociations, setGroupedAssociations] =
    createSignal<GroupedAssociations>();

  createEffect(on(stopDetailsItem, () => associatedSchools()));

  function associatedSchools() {
    setGroupedAssociations(
      _.groupBy(stopDetailsItem()?.associated, "schoolId")
    );
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
