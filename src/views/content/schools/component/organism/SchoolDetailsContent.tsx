import { Show } from "solid-js";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { SchoolUtils } from "../../../../../utils/school.utils";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";

import { HoursType } from "../../../../../_entities/_utils.entity";
import { SchoolType } from "../../../../../_entities/school.entity";
import { calendars } from "../../../../../_stores/calendar.store";
import {
  schoolDetailEditing,
  schoolDetails,
  setSchoolDetails,
} from "../template/SchoolDetails";
import "./SchoolDetailsContent.css";
import { SchoolHoursWrapper } from "./SchoolHoursWrapper";

export function SchoolDetailsContent() {
  function onChangeCalendarSelect(calendarId: number | string) {
    SchoolUtils.linkSchoolToCalendar(calendarId as number);
  }

  function updateHours(hours: HoursType) {
    setSchoolDetails((prev) => {
      return { ...prev, hours: hours } as SchoolType;
    });
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
            <SchoolHoursWrapper
              school={schoolDetails() as SchoolType}
              enabled={schoolDetailEditing()}
              onUpdate={updateHours}
            />
          </CollapsibleElement>
        </div>
      </Show>
    </>
  );
}
