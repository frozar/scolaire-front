import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { DateInput } from "../../../../component/molecule/DateInput";
import { setOnCalendarsPeriod } from "../template/Calendar";

import "./SchoolPeriodDateInput.css";

interface PeriodDateInputProps {
  calendarPeriod: CalendarPeriodType;
}

export function SchoolPeriodDateInput(props: PeriodDateInputProps) {
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
  return (
    <div class="period-date-inputs">
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
  );
}
