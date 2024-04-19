import {
  CalendarDayEnum,
  CalendarPeriodType,
  CalendarType,
  OrderedDaysList,
} from "../../../_entities/calendar.entity";
import { GradeType } from "../../../_entities/grade.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../_entities/trip-direction.entity";
import { calendars } from "../../../_stores/calendar.store";
import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { currentCalendar } from "./template/Calendar";

export namespace CalendarUtils {
  export function getById(calendarId: number): CalendarType {
    return calendars().filter((calendar) => calendar.id == calendarId)[0];
  }

  export function defaultCalendar(): CalendarType {
    const defaultDirection = TripDirectionEntity.findDirectionByDirectionName(
      TripDirectionEnum.roundTrip
    );

    return {
      id: 0,
      name: "",
      rules: [
        {
          day: CalendarDayEnum.monday,
          tripDirection: defaultDirection,
          tripTypeId: defaultDirection.id,
        },
        {
          day: CalendarDayEnum.tuesday,
          tripDirection: defaultDirection,
          tripTypeId: defaultDirection.id,
        },
        {
          day: CalendarDayEnum.wednesday,
          tripDirection: defaultDirection,
          tripTypeId: defaultDirection.id,
        },
        {
          day: CalendarDayEnum.thursday,
          tripDirection: defaultDirection,
          tripTypeId: defaultDirection.id,
        },
        {
          day: CalendarDayEnum.friday,
          tripDirection: defaultDirection,
          tripTypeId: defaultDirection.id,
        },
      ],
      added: [],
      calendarPeriodId: 0,
    };
  }
  export function getMonthName(date: Date): string {
    return date.toLocaleString("default", {
      month: "long",
    });
  }

  export function dayIsPublicHoliday(
    day: Date,
    calendarPeriod: CalendarPeriodType
  ) {
    let isHolidayDate = false;
    for (const publicHolidayDate of calendarPeriod.publicHolidays) {
      const date = new Date(
        publicHolidayDate.date.getFullYear(),
        publicHolidayDate.date.getMonth(),
        publicHolidayDate.date.getDate()
      );

      if (date.getTime() == day.getTime()) isHolidayDate = true;
    }
    return isHolidayDate;
  }

  export function dayIsInVacation(
    day: Date,
    calendarPeriod: CalendarPeriodType
  ): boolean {
    let isInVacation = false;
    for (const vacation of calendarPeriod.vacationsPeriod) {
      const startDate = () =>
        new Date(
          vacation.start.getFullYear(),
          vacation.start.getMonth(),
          vacation.start.getDate()
        );
      if (day >= startDate() && day <= vacation.end) isInVacation = true;
    }
    return isInVacation;
  }

  export function dayIsInPeriod(day: Date, calendarPeriod: CalendarPeriodType) {
    const startDate = () =>
      new Date(
        calendarPeriod.startDate.getFullYear(),
        calendarPeriod.startDate.getMonth(),
        calendarPeriod.startDate.getDate()
      );

    return day >= startDate() && day <= calendarPeriod.endDate;
  }

  export function orderedDays(days: CalendarDayEnum[]): CalendarDayEnum[] {
    const output: CalendarDayEnum[] = [];
    for (const day of OrderedDaysList) {
      if (days.length == output.length) {
        break;
      }
      for (const _day of days) {
        if (_day == day) {
          output.push(day);
          break;
        }
      }
    }
    return output;
  }

  export function commonDaysBetweenGrades(
    grades: GradeType[],
    direction: TripDirectionEnum
  ) {
    const unusedDays: CalendarDayEnum[] = [];
    for (const genericDay of OrderedDaysList) {
      for (const grade of grades) {
        if (grade.calendar) {
          if (
            !grade.calendar.rules.some(
              (rule) =>
                rule.day == genericDay &&
                rule.tripTypeId &&
                (TripDirectionEntity.findEnumById(rule.tripTypeId) ==
                  direction ||
                  TripDirectionEntity.findEnumById(rule.tripTypeId) ==
                    TripDirectionEnum.roundTrip)
            )
          ) {
            unusedDays.push(genericDay);
          }
        }
      }
    }

    return CalendarUtils.orderedDays(
      OrderedDaysList.filter((day) => !unusedDays.includes(day))
    );
  }

  export function dayToFrench(day: CalendarDayEnum): string {
    switch (day) {
      case CalendarDayEnum.monday:
        return "Lundi";
      case CalendarDayEnum.tuesday:
        return "Mardi";
      case CalendarDayEnum.wednesday:
        return "Mercredi";
      case CalendarDayEnum.thursday:
        return "Jeudi";
      case CalendarDayEnum.friday:
        return "Vendredi";
      case CalendarDayEnum.saturday:
        return "Samedi";
      case CalendarDayEnum.sunday:
        return "Dimanche";
      default:
        return "";
    }
  }

  export function getDaysOfMonth(date: Date): Date[] {
    const days = [];
    const numberOfDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    for (let i = 1; i <= numberOfDay; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  }

  export function getDayName(date: Date, toLower = false): string {
    const name = date.toLocaleString("en-EN", {
      weekday: "long",
    });
    return toLower ? name.toLowerCase() : name;
  }

  export function stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  export function dateToString(date: Date | undefined): string {
    if (!date) return "";
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${date.getFullYear()}-${month >= 10 ? month : "0" + month}-${
      day >= 10 ? day : "0" + day
    }`;
  }

  export function isActiveDay(date: Date, calendar: CalendarType): boolean {
    if (calendar.added.map((item) => item.date).includes(date.getTime()))
      return true;
    if (!CalendarUtils.isARulesDate(date, calendar)) return false;

    return true;
  }

  export function isWeekend(date: Date): boolean {
    const dayName = CalendarUtils.getDayName(date).toLowerCase();
    return dayName == "saturday" || dayName == "sunday";
  }

  export function compareDate(date: Date, toCompare: Date): boolean {
    if (
      date.getFullYear() == toCompare.getFullYear() &&
      date.getMonth() == toCompare.getMonth() &&
      CalendarUtils.getDayName(date) == CalendarUtils.getDayName(toCompare)
    )
      return true;
    else return false;
  }

  export function isAnAddedDate(date: Date, calendar: CalendarType): boolean {
    return calendar.added.some((item) => {
      const addedDate = new Date(item.date);
      if (
        addedDate.getFullYear() == date.getFullYear() &&
        addedDate.getMonth() == date.getMonth() &&
        addedDate.getDate() == date.getDate()
      )
        return true;
    });
  }

  export function isARulesDate(date: Date, calendar: CalendarType): boolean {
    const dayName = CalendarUtils.getDayName(date, true);
    if (
      calendar.rules
        .map((item) => item.day)
        .includes(dayName as CalendarDayEnum)
    )
      return true;
    return false;
  }

  export function isDayInRules(
    day: CalendarDayEnum,
    calendar: CalendarType
  ): boolean {
    return calendar.rules.map((item) => item.day).includes(day);
  }

  // Todo next step manage execption day
  export function dayTripDirection(
    day: CalendarDayEnum,
    calendar: CalendarType
  ): TripDirectionEnum {
    const rule = calendar.rules.find((item) => item.day == day);
    if (!rule?.tripTypeId) return TripDirectionEnum.none;
    return TripDirectionEntity.FindDirectionById(rule.tripTypeId).type;
  }

  export function isDateExistInAddedDate(date: Date) {
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
}
