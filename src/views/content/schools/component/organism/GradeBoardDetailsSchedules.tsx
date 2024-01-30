import { JSXElement } from "solid-js";
import { GradeEntity, HourFormat } from "../../../../../_entities/grade.entity";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { selectedGrade, setSelectedGrade } from "./GradeEditBoard";
import { HourRuleList } from "./HourRuleList";

export function GradeBoardDetailsSchedules(): JSXElement {
  function gradeCalendarName(): string {
    const gradeCalendar = selectedGrade()?.calendar;
    if (gradeCalendar) return gradeCalendar.name;
    else return "Pas de calendrier assigné";
  }

  function hourValue(value: HourFormat | null | undefined) {
    return value ? GradeEntity.getStringFromHourFormat(value) : "--";
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
            startValue={hourValue(selectedGrade()?.hours.startHourComing)}
            endValue={hourValue(selectedGrade()?.hours.endHourComing)}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <TimesInputWrapper
            label="Après-midi"
            startValue={hourValue(selectedGrade()?.hours.startHourGoing)}
            endValue={hourValue(selectedGrade()?.hours.endHourGoing)}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <HourRuleList
            item={selectedGrade}
            setItem={setSelectedGrade}
            enabled={false}
          />
        </CollapsibleElement>
      </div>
    </>
  );
}
