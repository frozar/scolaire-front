import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import Button from "../../../../component/atom/Button";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarManager } from "../calendar.manager";
import { SchoolPeriodDateInput } from "../molecule/SchoolPeriodDateInput";
import { CalendarPeriodTable } from "./CalendarPeriodTable";
import { PublicHolidayItem } from "./PublicHolidayItem";
import { PublicHolidayList } from "./PublicHolidayList";
import { VacationItem } from "./VacationItem";
import { VacationList } from "./VacationList";

import { Show } from "solid-js";
import { calendarsPeriod } from "../../../../_stores/calendar-period.store";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
import "./CalendarPeriod.css";

interface SchoolCalendarProps {
  date: Date;
  calendarPeriod: CalendarPeriodType;
}

export function CalendarPeriod(props: SchoolCalendarProps) {
  async function save() {
    enableSpinningWheel();
    await CalendarManager.updateCalendarPeriod(props.calendarPeriod);
    disableSpinningWheel();
  }

  return (
    <section class="calendar-period">
      <CalendarPeriodTable
        currentMonth={props.date}
        calendarsPeriod={calendarsPeriod()}
      />
      <Show when={props.calendarPeriod}>
        <div class="calendar-period-section">
          <CalendarSectionTitle title="Edition période scolaire" />
          <SchoolPeriodDateInput calendarPeriod={props.calendarPeriod} />
        </div>
        <div class="calendar-period-vacation-x-holiday">
          <div class="calendar-period-section">
            <CalendarSectionTitle title="Vacances" />
            <VacationList calendarPeriod={props.calendarPeriod} />
            <VacationItem />
          </div>

          <div class="calendar-period-section">
            <CalendarSectionTitle title="Jour férié" />
            <PublicHolidayList calendarPeriod={props.calendarPeriod} />
            <PublicHolidayItem />
          </div>
        </div>
      </Show>
      <div class="calendar-period-footer">
        <Button label="Enregistrer" onClick={save} />
      </div>
    </section>
  );
}
