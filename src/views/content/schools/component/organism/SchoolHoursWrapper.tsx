import { JSXElement, createEffect, createSignal } from "solid-js";
import {
  HourRuleType,
  HoursType,
} from "../../../../../_entities/_utils.entity";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { GradeHourRuleList } from "./GradeHourRuleList";
import { SchoolHoursSlots } from "./SchoolHoursSlots";

export function SchoolHoursWrapper(props: {
  school: SchoolType;
  enabled: boolean;
  onUpdate: (hours: HoursType) => void;
}): JSXElement {
  const [localHours, setLocalHours] = createSignal<HoursType>(
    // eslint-disable-next-line solid/reactivity
    props.school.hours
  );

  createEffect(() => {
    setLocalHours(props.school.hours);
  });

  createEffect(() => {
    props.onUpdate(localHours());
  });

  function onUpdateHourRules(rules: HourRuleType[]) {
    setLocalHours((prev) => {
      return {
        ...prev,
        rules: [...rules],
      };
    });
  }

  return (
    <div>
      <SchoolHoursSlots school={props.school} />
      <GradeHourRuleList
        rules={localHours().rules}
        calendar={props.school.calendar as CalendarType}
        onUpdate={onUpdateHourRules}
        enabled={props.enabled}
      />
    </div>
  );
}
