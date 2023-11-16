import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import Button from "../../../../component/atom/Button";
import { DateInput } from "../../../../component/molecule/DateInput";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarManager } from "../calendar.manager";
import { calendarsPeriod, setOnCalendarsPeriod } from "../template/Calendar";
import "./CalendarPeriod.css";
import { CalendarPeriodTable } from "./CalendarPeriodTable";
import { PublicHolidayItem } from "./PublicHolidayItem";
import { PublicHolidayList } from "./PublicHolidayList";
import { VacationItem } from "./VacationItem";
import { VacationList } from "./VacationList";
interface SchoolCalendarProps {
  date: Date;
  calendarPeriod: CalendarPeriodType;
}

export function CalendarPeriod(props: SchoolCalendarProps) {
  function onChangeStartDate(date: Date) {
    setOnCalendarsPeriod((prev) => {
      if (prev == undefined) return prev;
      return { ...prev, startDate: date };
    });
  }

  function onChangeEndDate(date: Date) {
    setOnCalendarsPeriod((prev) => {
      if (prev == undefined) return prev;
      return { ...prev, endDate: date };
    });
  }

  async function save() {
    await CalendarManager.updateCalendarPeriod(props.calendarPeriod);
  }

  return (
    <section class="calendar-period">
      <CalendarPeriodTable
        currentMonth={props.date}
        calendarsPeriod={calendarsPeriod()}
      />

      <div class="edit-school-period">
        <CalendarSectionTitle title="Edition période scolaire" />

        <div class="flex gap-20 mt-5">
          <DateInput
            onChange={onChangeStartDate}
            label="Début d'année"
            defaultValue={props.calendarPeriod.startDate}
            maxDate={props.calendarPeriod.endDate}
          />

          <DateInput
            onChange={onChangeEndDate}
            label="Fin d'année"
            defaultValue={props.calendarPeriod.endDate}
            minDate={props.calendarPeriod.startDate}
          />
        </div>
      </div>

      <div class="flex gap-48 ">
        <div class="edit-school-period">
          <CalendarSectionTitle title="Vacances" />
          <VacationList calendarPeriod={props.calendarPeriod} />
          <VacationItem />
        </div>

        <div class="edit-school-period">
          <CalendarSectionTitle title="Jour férié" />
          <PublicHolidayList calendarPeriod={props.calendarPeriod} />
          <PublicHolidayItem />
        </div>
      </div>

      <div class="flex justify-end w-[97%]">
        <Button label="Enregistrer" onClick={save} />
      </div>
    </section>
  );
}
