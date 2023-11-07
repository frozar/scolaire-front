import _ from "lodash";
import { For } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import StudentSchoolGradeItem from "../molecul/StudentSchoolGradeItem";

export default function (props: { associatedSchools: AssociatedSchoolType[] }) {
  // eslint-disable-next-line solid/reactivity
  const associatedSchools = _.groupBy(props.associatedSchools, "schoolId");
  // TODO: Rename and move
  function getRemaining() {
    return "TODO";
  }

  return (
    <For each={_.keys(associatedSchools)}>
      {(schoolId) => (
        <CollapsibleElement
          title={
            associatedSchools[schoolId][0].schoolName +
            " " +
            getRemaining() +
            " / "
            // +
            // StopUtils.getTotalQuantityPerSchool()
          }
        >
          <For each={associatedSchools[schoolId]}>
            {(associatedSchool) => (
              <StudentSchoolGradeItem school={associatedSchool} />
            )}
          </For>
        </CollapsibleElement>
      )}
    </For>
  );
}
