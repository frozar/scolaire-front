import {
  CalendarDayEnum,
  CalendarPeriodType,
  CalendarType,
  DateAddedType,
  PublicHolidayType,
  VacationPeriodType,
} from "../../../_entities/calendar.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../_entities/trip-direction.entity";
import { CalendarService } from "../../../_services/calendar.service";
import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { CalendarUtils } from "./calendar.utils";
import {
  currentCalendar,
  setCalendars,
  setCalendarsPeriod,
  setCurrentCalendar,
  setOnCalendarsPeriod,
} from "./template/Calendar";

// * this namespace is to manage the editioning calendarPeriod
export namespace CalendarManager {
  export function updateTripDirection(
    calendar: CalendarType,
    day: CalendarDayEnum,
    direction: TripDirectionEnum
  ) {
    const index = calendar.rules.findIndex((item) => item.day == day);
    if (index == -1) return false;
    const tripDirectionId = TripDirectionEntity.findTripByDirection(direction);

    setCurrentCalendar((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      prev.rules[index].tripTypeId = tripDirectionId;
      return datas;
    });
  }

  export function pushCalendar(calendar: CalendarType) {
    setCalendars((prev) => {
      if (prev == undefined) return prev;
      prev = [...prev, calendar];
      return prev;
    });
  }

  export async function createCalendarPeriod(
    calendarPeriod: Omit<CalendarPeriodType, "id">
  ) {
    const _calendarPeriod = await CalendarService.createCalendarPeriod(
      calendarPeriod
    );
    setCalendarsPeriod((prev) => {
      if (prev == undefined) return prev;
      prev = [...prev, _calendarPeriod];
      return prev;
    });
    setOnCalendarsPeriod(_calendarPeriod);
  }

  export async function updateCalendarPeriod(
    calendarPeriod: CalendarPeriodType
  ) {
    const _calendarPeriod = await CalendarService.updateCalendarPeriod(
      calendarPeriod
    );
    setCalendarsPeriod((prev) => {
      if (prev == undefined) return prev;
      const datas = [...prev];
      const index = datas.findIndex((item) => item.id == calendarPeriod.id);
      if (index == -1) return datas;
      datas[index] = _calendarPeriod;
      return datas;
    });
  }

  function isDateExistInAddedDate(date: Date) {
    const sameDate =
      currentCalendar()?.added.filter((item) =>
        CalendarUtils.compareDate(new Date(item.date as number), date)
      ) ?? [];

    if (sameDate.length > 0) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Vous ne pouvez pas ajouter une date déjà présente dans les dates ajoutées.",
      });
      return true;
    } else return false;
  }

  export function appendAddedDate(date: DateAddedType): void {
    if (isDateExistInAddedDate(new Date(date.date))) return;

    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };
      data.added.push({
        date: date.date,
        reference: date.reference,
      });
      return data;
    });
  }

  export function updateAddedDate(
    currentDate: DateAddedType,
    newDate: DateAddedType
  ): void {
    if (isDateExistInAddedDate(new Date(newDate.date))) return;

    const indexFirst =
      currentCalendar()?.added.findIndex(
        (item) => item.date == currentDate.date
      ) ?? -1;

    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };
      data.added[indexFirst] = {
        date: newDate.date,
        reference: newDate.reference,
      };
      return data;
    });
  }

  export function removeAddedDate(date: Date): void {
    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };
      data.added = data.added.filter((item) => item.date != date.getTime());
      return data;
    });
  }

  export function linkToPeriodCalendar(calendarPeriod?: CalendarPeriodType) {
    setCurrentCalendar((prev) => {
      if (!prev) return prev;
      const datas = { ...prev };
      datas.calendarPeriodId = calendarPeriod?.id;
      return datas;
    });
  }

  export function updateCalendarRules(day: CalendarDayEnum) {
    const indexof = currentCalendar()?.rules.findIndex(
      (item) => item.day == day
    );

    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };

      if (indexof == -1) data.rules.push({ day: day });
      else data.rules = data.rules.filter((item) => item.day != day);
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
