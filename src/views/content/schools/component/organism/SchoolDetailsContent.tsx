import { SchoolType } from "../../../../../_entities/school.entity";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { calendars } from "../../../calendar/template/Calendar";
import { HourRuleList } from "./HourRuleList";
import {
  schoolDetailEditing,
  schoolDetailsItem,
  setSchoolDetailsItem,
} from "./SchoolDetails";
import { SchoolHoursSlots } from "./SchoolHoursSlots";

import "./SchoolDetailsContent.css";

export function SchoolDetailsContent() {
  // ! Useless ??
  // function schoolToDisplay(): SchoolType {
  //   return schoolDetailEditing()
  //     ? (schoolDetailsItem() as SchoolType)
  //     : SchoolUtils.get((schoolDetailsItem() as SchoolType).id);
  // }

  function onChangeCalendarSelect(value: number | string) {
    SchoolUtils.linkSchoolToCalendar(value as number);
  }

  return (
    <>
      <LabeledInputSelect
        defaultOptions="Sélectionner calendrier"
        // defaultValue={schoolToDisplay()?.calendar?.id ?? 0}
        defaultValue={schoolDetailsItem()?.calendar?.id ?? 0}
        label="Calendrier lié"
        onChange={onChangeCalendarSelect}
        options={calendars().map((item) => {
          return { value: item.id, text: item.name };
        })}
        disabled={!schoolDetailEditing()}
        indented={true}
      />
      <div class="time">
        <CollapsibleElement
          title="Tranches horaires"
          titleClass="text-xl"
          closedByDefault={() => !schoolDetailEditing()}
        >
          {/* <SchoolHoursSlots school={schoolToDisplay() as SchoolType} /> */}
          <SchoolHoursSlots school={schoolDetailsItem() as SchoolType} />

          <HourRuleList
            // item={schoolToDisplay}
            item={schoolDetailsItem}
            setItem={setSchoolDetailsItem}
            disabled={schoolDetailEditing()}
          />
        </CollapsibleElement>
      </div>
    </>
  );
}
