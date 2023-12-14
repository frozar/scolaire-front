import { CalendarType, PublicHolidayType } from "../_entities/calendar.entity";
import { CalendarDatesType } from "../_entities/gtfs.entity";
import { TripType } from "../_entities/trip.entity";
import { CalendarUtils } from "../views/content/calendar/calendar.utils";
import { calendarsPeriod } from "../views/content/calendar/template/Calendar";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { CalendarPeriodUtils } from "./calendarPeriod.utils";

export namespace GtfsUtils {
  export function getPublicHolidaysExceptions(
    periodIds: number[],
    serviceId: number,
    calendarDates: CalendarDatesType[]
  ): CalendarDatesType[] {
    const newCalendarDates: CalendarDatesType[] = [];

    const publicHolidays: PublicHolidayType[] = periodIds.flatMap(
      (periodId) => CalendarPeriodUtils.getById(periodId).publicHolidays
    );

    const tempPublicHolidays: string[] = [];

    for (const publicHoliday of publicHolidays) {
      tempPublicHolidays.push(GtfsUtils.formatDate(publicHoliday.date));
    }

    const countedPublicHolidays = GtfsUtils.count(tempPublicHolidays);
    for (const formatedDate of Object.keys(countedPublicHolidays)) {
      const newExceptionDate = {
        service_id: serviceId,
        date: formatedDate,
        exception_type: 2,
      };

      if (
        !GtfsUtils.isDateExceptionAlreadyAdded(
          newExceptionDate,
          calendarDates
        ) &&
        !GtfsUtils.isDateExceptionAlreadyAdded(
          newExceptionDate,
          newCalendarDates
        )
      ) {
        newCalendarDates.push(newExceptionDate);
      }
    }

    return newCalendarDates;
  }

  export function count(list: string[]): { [id: string]: number } {
    const counter: { [id: string]: number } = {};
    list.forEach((ele) => {
      if (counter[ele]) {
        counter[ele] += 1;
      } else {
        counter[ele] = 1;
      }
    });

    return counter;
  }

  export function getVacationsExceptions(
    periodIds: number[],
    serviceId: number,
    calendarDates: CalendarDatesType[]
  ): CalendarDatesType[] {
    const newCalendarDates: CalendarDatesType[] = [];

    const numberOfPeriods = periodIds.length;
    const vacationPeriods = periodIds.flatMap(
      (periodId) => CalendarPeriodUtils.getById(periodId).vacationsPeriod
    );

    const tempVacationsDates: string[] = [];

    for (const vacationPeriod of vacationPeriods) {
      const diffDays =
        vacationPeriod.end.getDate() - vacationPeriod.start.getDate();

      for (let dayToAdd = 0; dayToAdd < diffDays + 1; dayToAdd++) {
        tempVacationsDates.push(
          GtfsUtils.addDays(vacationPeriod.start, dayToAdd)
        );
      }
    }

    const countedDate = count(tempVacationsDates);

    for (const key of Object.keys(countedDate)) {
      if (countedDate[key] == numberOfPeriods) {
        const newExceptionDate = {
          service_id: serviceId,
          date: key,
          exception_type: 2,
        };

        if (
          !GtfsUtils.isDateExceptionAlreadyAdded(
            newExceptionDate,
            calendarDates
          ) &&
          !GtfsUtils.isDateExceptionAlreadyAdded(
            newExceptionDate,
            newCalendarDates
          )
        ) {
          newCalendarDates.push(newExceptionDate);
        }
      }
    }

    return newCalendarDates;
  }

  export function getAddedDateExceptions(
    serviceId: number,
    gradeIds: number[],
    calendarDates: CalendarDatesType[]
  ): CalendarDatesType[] {
    const newCalendarDates: CalendarDatesType[] = [];

    let calendarIds = getSchools()
      .flatMap((school) => school.grades)
      .filter((_grade) => gradeIds.includes(_grade.id as number))
      .map((grade) => grade.calendar)
      .map((calendar) => (calendar as CalendarType).id);

    calendarIds = Array.from(new Set(calendarIds));
    for (const calendarId of calendarIds) {
      const calendar = CalendarUtils.getById(calendarId as number);
      const addedDates = calendar.added;
      for (const addedDate of addedDates) {
        const newExceptionDate = {
          service_id: serviceId,
          date: GtfsUtils.formatDate(new Date(addedDate.date)),
          exception_type: 1,
        };

        if (
          !GtfsUtils.isDateExceptionAlreadyAdded(
            newExceptionDate,
            calendarDates
          ) &&
          !GtfsUtils.isDateExceptionAlreadyAdded(
            newExceptionDate,
            newCalendarDates
          )
        ) {
          newCalendarDates.push(newExceptionDate);
        }
      }
    }

    return newCalendarDates;
  }

  export function getStartEndDates(trip: TripType): {
    startDate: string;
    endDate: string;
  } {
    const gradeIds = trip.grades.map((grade) => grade.id as number);
    const calendarPeriodIds = getSchools()
      .flatMap((school) => school.grades)
      .filter((grade) => gradeIds.includes(grade.id as number))
      .map((_grade) => _grade.calendar as CalendarType)
      .map((calendar) => calendar.calendarPeriodId as number);

    const calendarPeriods = calendarsPeriod().filter((calendarPeriod) =>
      calendarPeriodIds.includes(calendarPeriod.id)
    );

    // Take the earlier start date and the latest endDate
    let startDate: string;
    let endDate: string;
    if (calendarPeriods.length == 1) {
      startDate = GtfsUtils.formatDate(calendarPeriods[0].startDate);
      endDate = GtfsUtils.formatDate(calendarPeriods[0].endDate);
    } else {
      let tempStartDate: Date = calendarPeriods[0].startDate;
      let tempEndDate: Date = calendarPeriods[0].endDate;

      for (const calendarPeriod of calendarPeriods) {
        if (calendarPeriod.startDate < tempStartDate) {
          tempStartDate = calendarPeriod.startDate;
        }
        if (calendarPeriod.endDate > tempEndDate) {
          tempEndDate = calendarPeriod.endDate;
        }
      }

      startDate = GtfsUtils.formatDate(tempStartDate);
      endDate = GtfsUtils.formatDate(tempEndDate);
    }

    return { startDate, endDate };
  }

  export function formatDate(date: Date): string {
    const day = date.getDate();
    const formatedDay =
      String(day).length == 1 ? "0" + String(day) : String(day);

    const month = date.getMonth() + 1;
    const formatedMonth =
      String(month).length == 1 ? "0" + String(month) : String(month);

    return String(date.getFullYear()) + formatedMonth + formatedDay;
  }

  export function addDays(date: Date, daysToAdd: number): string {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + daysToAdd
    );
    return formatDate(newDate);
  }

  export function isDateExceptionAlreadyAdded(
    calendarDate: CalendarDatesType,
    calendarDates: CalendarDatesType[]
  ): boolean {
    for (const exceptionDate of calendarDates) {
      if (
        exceptionDate.service_id == calendarDate.service_id &&
        exceptionDate.date == calendarDate.date
      ) {
        return true;
      }
    }
    return false;
  }
}
