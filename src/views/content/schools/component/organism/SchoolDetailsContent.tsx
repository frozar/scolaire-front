import { Show } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import { HourRuleList } from "./HourRuleList";
import { SchoolHoursSlots } from "./SchoolHoursSlots";

import { calendars } from "../../../../../_stores/calendar.store";
import {
  schoolDetailEditing,
  schoolDetails,
  setSchoolDetails,
} from "../template/SchoolDetails";
import "./SchoolDetailsContent.css";

export function SchoolDetailsContent() {
  function onChangeCalendarSelect(calendarId: number | string) {
    SchoolUtils.linkSchoolToCalendar(calendarId as number);
  }

  return (
    <>
      <LabeledInputSelect
        defaultOptions="Sélectionner calendrier"
        defaultValue={schoolDetails()?.calendar?.id ?? -1}
        label="Calendrier:"
        onChange={onChangeCalendarSelect}
        options={calendars().map((item) => {
          return { value: item.id, text: item.name };
        })}
        disabled={!schoolDetailEditing()}
        indented={true}
      />

      <Show when={schoolDetails()?.calendar}>
        <div class="time">
          <CollapsibleElement
            title="Tranches horaires"
            titleClass="text-xl"
            closedByDefault={() => !schoolDetailEditing()}
          >
            <SchoolHoursSlots school={schoolDetails() as SchoolType} />

            <HourRuleList
              item={schoolDetails}
              setItem={setSchoolDetails}
              enabled={schoolDetailEditing()}
            />
          </CollapsibleElement>
        </div>
      </Show>
    </>
  );
}
