import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import Button from "../../../../component/atom/Button";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarManager } from "../calendar.manager";
import { SchoolPeriodDateInput } from "../molecule/SchoolPeriodDateInput";
import { calendarsPeriod } from "../template/Calendar";
import { CalendarPeriodTable } from "./CalendarPeriodTable";
import { PublicHolidayItem } from "./PublicHolidayItem";
import { PublicHolidayList } from "./PublicHolidayList";
import { VacationItem } from "./VacationItem";
import { VacationList } from "./VacationList";

import "./CalendarPeriod.css";

interface SchoolCalendarProps {
  date: Date;
  calendarPeriod: CalendarPeriodType;
}

export function CalendarPeriod(props: SchoolCalendarProps) {
  async function save() {
    await CalendarManager.updateCalendarPeriod(props.calendarPeriod);
  }

  return (
    <section class="calendar-period">
      <CalendarPeriodTable
        currentMonth={props.date}
        calendarsPeriod={calendarsPeriod()}
      />

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

      <div class="calendar-period-footer">
        <Button label="Enregistrer" onClick={save} />
      </div>
    </section>
  );
}
