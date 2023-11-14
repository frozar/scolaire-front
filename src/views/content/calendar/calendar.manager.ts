import {
  CalendarDayEnum,
  CalendarType,
  PublicHolidayType,
  VacationPeriodType,
} from "../../../_entities/calendar.entity";
import {
  currentCalendar,
  setCalendars,
  setCurrentCalendar,
  setOnCalendarsPeriod,
} from "./template/Calendar";

// * this namespace is to manage the editioning calendarPeriod
export namespace CalendarManager {
  export function pushCalendar(calendar: CalendarType) {
    setCalendars((prev) => {
      if (prev == undefined) return prev;
      prev = [...prev, calendar];
      return prev;
    });
  }

  // * this function will push or remove added date onto the current calendar edition
  export function toggleAddedDate(date: Date) {
    const indexof = currentCalendar()?.added.findIndex(
      (item) => item == date.getTime()
    );

    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };

      if (indexof == -1) data.added.push(date.getTime());
      else data.added = data.added.filter((item) => item != date.getTime());

      return data;
    });
  }

  // * this function will push or remove deleted date onto the current calendar edition
  export function toggleDeletedDate(date: Date) {
    const indexof = currentCalendar()?.deleted.findIndex(
      (item) => item == date.getTime()
    );

    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };

      if (indexof == -1) data.deleted.push(date.getTime());
      else data.deleted = data.deleted.filter((item) => item != date.getTime());

      return data;
    });
  }

  export function updateCalendarRules(day: CalendarDayEnum) {
    const indexof = currentCalendar()?.rules.findIndex((item) => item == day);

    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };

      if (indexof == -1) data.rules.push(day);
      else data.rules = data.rules.filter((item) => item != day);
      return data;
    });
  }

  export function updateCalendar(calendar: CalendarType) {
    setCalendars((prev) => {
      if (prev == undefined) return prev;
      const calendars = [...prev];
      const indexOfCalendar = calendars.findIndex(
        (item) => item.id == calendar.id
      );
      calendars[indexOfCalendar] = calendar;
      return calendars;
    });
  }

  export function pushVacationToCalendarPeriod(vacation: VacationPeriodType) {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.vacationsPeriod.push(vacation);
      return datas;
    });
  }

  export function updateVacation(
    name: string,
    vacation: VacationPeriodType,
    fields: "all" | "date"
  ) {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      const index = datas.vacationsPeriod.findIndex(
        (item) => item.name == name
      );
      if (index == -1) return datas;
      if (fields == "date") {
        datas.vacationsPeriod[index].start = vacation.start;
        datas.vacationsPeriod[index].end = vacation.end;
      } else datas.vacationsPeriod[index] = vacation;
      return datas;
    });
  }

  export function removeVacation(vacation: VacationPeriodType) {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.vacationsPeriod = datas.vacationsPeriod.filter(
        (item) => item.name != vacation.name
      );
      return datas;
    });
  }

  export function pushPublicHolidayToCalendarPeriod(
    publicHoliday: PublicHolidayType
  ) {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.publicHolidays.push(publicHoliday);
      return datas;
    });
  }

  export function updatePublicHoliday(
    name: string,
    publicHoliday: PublicHolidayType,
    fields: "all" | "date"
  ) {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      const index = datas.publicHolidays.findIndex((item) => item.name == name);
      if (index == -1) return datas;
      if (fields == "date") {
        datas.publicHolidays[index].date = publicHoliday.date;
      } else datas.publicHolidays[index] = publicHoliday;
      return datas;
    });
  }

  export function removePublicHoliday(publicHoliday: PublicHolidayType) {
    setOnCalendarsPeriod((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.publicHolidays = datas.publicHolidays.filter(
        (item) => item.name != publicHoliday.name
      );
      return datas;
    });
  }
}
