import { JSXElement } from "solid-js";
import { CalendarType } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { GradeHourRuleList } from "./GradeHourRuleList";

export function GradeDetailsBoardSchedules(props: {
  grade: GradeType;
}): JSXElement {
  //TODO à revoir
  function gradeCalendarName(): string {
    const gradeCalendar = props.grade.calendar;
    if (gradeCalendar) return gradeCalendar.name;
    else return "Pas de calendrier assigné";
  }

  return (
    <>
      <div class="mb-4">
        <div class="text-xl">Calendrier:</div>
        <div class="text-green-base pl-[18px]">{gradeCalendarName()}</div>
      </div>

      <div>
        <CollapsibleElement
          title="Tranches horaires"
          titleClass="text-xl"
          closedByDefault={() => true}
        >
          <TimesInputWrapper
            label="Matin"
            startValue={props.grade.hours.startHourComing}
            endValue={props.grade.hours.endHourComing}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <TimesInputWrapper
            label="Après-midi"
            startValue={props.grade.hours.startHourGoing}
            endValue={props.grade.hours.endHourGoing}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <GradeHourRuleList
            rules={props.grade.hours.rules}
            calendar={props.grade.calendar as CalendarType}
            enabled={false}
          />
        </CollapsibleElement>
      </div>
    </>
  );
}
