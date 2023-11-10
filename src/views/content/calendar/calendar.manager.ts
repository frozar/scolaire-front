import {
  CalendarDayEnum,
  CalendarType,
} from "../../../_entities/calendar.entity";
import {
  currentCalendar,
  setCalendars,
  setCurrentCalendar,
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
}
