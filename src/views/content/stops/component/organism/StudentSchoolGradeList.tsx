import _ from "lodash";
import { For } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { StopUtils } from "../../../../../utils/stop.utils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import StudentSchoolGradeItem from "../molecul/StudentSchoolGradeItem";

export default function (props: { stop: StopType }) {
  function associatedSchools() {
    return _.groupBy(props.stop.associated, "schoolId");
  }

  return (
    <For each={_.keys(associatedSchools())}>
      {(schoolId) => (
        <CollapsibleElement
          title={
            associatedSchools()[schoolId][0].schoolName +
            " " +
            StopUtils.getRemainingQuantityPerSchool(
              props.stop.id,
              Number(schoolId)
            ) +
            " / " +
            StopUtils.getTotalQuantityPerSchool(props.stop.id, Number(schoolId))
          }
        >
          <For each={associatedSchools()[schoolId]}>
            {(associatedSchool) => (
              <StudentSchoolGradeItem school={associatedSchool} />
            )}
          </For>
        </CollapsibleElement>
      )}
    </For>
  );
}
