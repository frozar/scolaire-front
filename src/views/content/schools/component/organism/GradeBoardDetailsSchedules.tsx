import { JSXElement } from "solid-js";
import { GradeEntity } from "../../../../../_entities/grade.entity";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import TimesInputWrapper from "../molecule/TimesInputWrapper";
import { selectedGrade, setSelectedGrade } from "./GradeBoard";
import { HourRuleList } from "./HourRuleList";

export function GradeBoardDetailsSchedules(): JSXElement {
  return (
    <>
      <div class="mb-4">
        <div class="text-xl">Calendrier:</div>
        <div class="text-green-base pl-[18px]">
          {selectedGrade()?.calendar?.name as string}
        </div>
      </div>

      <div>
        <CollapsibleElement
          title="Tranches horaires"
          titleClass="text-xl"
          closedByDefault={() => true}
        >
          <TimesInputWrapper
            label="Matin"
            startValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.startHourComing
            )}
            endValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.endHourComing
            )}
            disabled={true}
            onInputStart={() => ""}
            onInputEnd={() => ""}
          />
          <TimesInputWrapper
            label="Après-midi"
            startValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.startHourGoing
            )}
            endValue={GradeEntity.getStringFromHourFormat(
              selectedGrade()?.hours.endHourGoing
            )}
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
