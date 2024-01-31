import { JSXElement } from "solid-js";
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
            startValue={selectedGrade()?.hours.startHourComing}
            endValue={selectedGrade()?.hours.endHourComing}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <TimesInputWrapper
            label="Après-midi"
            startValue={selectedGrade()?.hours.startHourGoing}
            endValue={selectedGrade()?.hours.endHourGoing}
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
