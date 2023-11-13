import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import Button from "../../../../component/atom/Button";
import { DateInput } from "../../../../component/molecule/DateInput";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarMonthsDetails } from "../molecule/CalendarMonthsDetails";
import { setCalendarsPeriod, setOnCalendarsPeriod } from "../template/Calendar";
import { CalendarHeader } from "./CalendarHeader";
import "./CalendarPeriod.css";
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
    const calendarPeriod = await CalendarService.updateCalendarPeriod(
      props.calendarPeriod
    );
    setCalendarsPeriod((prev) => {
      if (prev == undefined) return prev;
      const datas = [...prev];
      const index = datas.findIndex((item) => item.id == calendarPeriod.id);
      if (index == -1) return datas;
      datas[index] = calendarPeriod;
      return datas;
    });
  }

  return (
    <section class="calendar-period">
      <CalendarSectionTitle title="Calendrier scolaire" />
      <CalendarHeader month={props.date} />

      <div class="calendar-period-calendar">
        <CalendarMonthsDetails
          month={props.date}
          calendarPeriod={props.calendarPeriod}
        />
      </div>

      <div class="edit-school-period">
        <CalendarSectionTitle title="Edition période scolaire" />

        <div class="flex gap-20 mt-5">
          <DateInput
            disabled={false}
            onChange={onChangeStartDate}
            label="Début d'année"
            defaultValue={props.calendarPeriod.startDate}
            maxDate={props.calendarPeriod.endDate}
          />

          <DateInput
            disabled={false}
            onChange={onChangeEndDate}
            label="Fin d'année"
            defaultValue={props.calendarPeriod.endDate}
            minDate={props.calendarPeriod.startDate}
          />
        </div>
      </div>

      <div class="edit-school-period">
        <CalendarSectionTitle title="Vacances" />
        <VacationList calendarPeriod={props.calendarPeriod} />
        <VacationItem />
      </div>

      <Button label="Save" onClick={save} />
    </section>
  );
}
