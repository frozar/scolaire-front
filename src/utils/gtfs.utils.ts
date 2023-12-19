import {
  CalendarDayEnum,
  CalendarType,
  PublicHolidayType,
} from "../_entities/calendar.entity";
import {
  GtfsCalendarDatesType,
  GtfsCalendarType,
} from "../_entities/gtfs.entity";
import { TripType } from "../_entities/trip.entity";
import { CalendarUtils } from "../views/content/calendar/calendar.utils";
import { calendarsPeriod } from "../views/content/calendar/template/Calendar";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { CalendarPeriodUtils } from "./calendarPeriod.utils";
import { TripUtils } from "./trip.utils";

export namespace GtfsUtils {
  // // TODO: Refactor
  // // Exceptionally calendar_dates.txt is computed front-side
  // export function getServiceWindowsAndCalendarDates(): {
  //   serviceWindows: ServiceWindowType[];
  //   calendarDates: CalendarDatesType[];
  // } {
  //   let serviceId = 0;
  //   const trips = TripUtils.getAll();
  //   const gtfsCalendars: string[] = [];
  //   const serviceWindows: ServiceWindowType[] = [];
  //   const calendarDates: CalendarDatesType[] = [];

  //   trips.forEach((trip) => {
  //     const { startDate, endDate } = GtfsUtils.getStartEndDates(trip);
  //     if (!gtfsCalendars.includes(startDate + endDate + trip.days.toString())) {
  //       serviceId += 1;
  //       gtfsCalendars.push(startDate + endDate + trip.days.toString());

  //       // TODO: Use real values for start_time and end_time ?
  //       // TODO: Find a way to not use "weekday_peak_" ?
  //       // TODO: Manage service_id here to avoid desync

  //       // Add a calendar
  //       serviceWindows.push({
  //         service_window_id: "weekday_peak_" + String(serviceId),
  //         // 1 Hour interval with service frequency 1 to don't have duplicate trips
  //         start_time: "07:00:00",
  //         end_time: "08:00:00",
  //         start_date: startDate,
  //         end_date: endDate,
  //         monday: trip.days.includes(CalendarDayEnum.monday) ? 1 : 0,
  //         tuesday: trip.days.includes(CalendarDayEnum.tuesday) ? 1 : 0,
  //         wednesday: trip.days.includes(CalendarDayEnum.wednesday) ? 1 : 0,
  //         thursday: trip.days.includes(CalendarDayEnum.thursday) ? 1 : 0,
  //         friday: trip.days.includes(CalendarDayEnum.friday) ? 1 : 0,
  //         saturday: trip.days.includes(CalendarDayEnum.saturday) ? 1 : 0,
  //         sunday: trip.days.includes(CalendarDayEnum.sunday) ? 1 : 0,
  //       });

  //       // Add added date to exceptions
  //       const gradeIds = trip.grades.map((grade) => grade.id as number);

  //       const newExceptionDates = GtfsUtils.getAddedDateExceptions(
  //         serviceId,
  //         gradeIds,
  //         calendarDates
  //       );

  //       newExceptionDates.forEach((newExceptionDate) =>
  //         calendarDates.push(newExceptionDate)
  //       );

  //       // Add vacations to exceptions
  //       const periodIds = getSchools()
  //         .flatMap((school) => school.grades)
  //         .filter((_grade) => gradeIds.includes(_grade.id as number))
  //         .map(
  //           (grade) =>
  //             (grade.calendar as CalendarType).calendarPeriodId as number
  //         );

  //       const newVacationsExceptionsDate = GtfsUtils.getVacationsExceptions(
  //         periodIds,
  //         serviceId,
  //         calendarDates
  //       );

  //       newVacationsExceptionsDate.forEach((newExceptionDate) =>
  //         calendarDates.push(newExceptionDate)
  //       );

  //       // Add public holidays to exceptions
  //       const newPublicHolidayExceptionDates =
  //         GtfsUtils.getPublicHolidaysExceptions(
  //           periodIds,
  //           serviceId,
  //           calendarDates
  //         );

  //       newPublicHolidayExceptionDates.forEach((newExceptionDate) =>
  //         calendarDates.push(newExceptionDate)
  //       );
  //     }
  //   });

  //   return { serviceWindows, calendarDates };
  // }

  // TODO: Refactor
  // Exceptionally calendar_dates.txt is computed front-side
  export function getServiceWindowsAndCalendarDates(): {
    calendars: GtfsCalendarType[];
    calendarDates: GtfsCalendarDatesType[];
  } {
    let serviceId = 0;
    const trips = TripUtils.getAll();
    const gtfsCalendars: string[] = [];
    const calendars: GtfsCalendarType[] = [];
    const calendarDates: GtfsCalendarDatesType[] = [];

    trips.forEach((trip) => {
      const { startDate, endDate } = GtfsUtils.getStartEndDates(trip);
      if (!gtfsCalendars.includes(startDate + endDate + trip.days.toString())) {
        serviceId += 1;
        gtfsCalendars.push(startDate + endDate + trip.days.toString());

        // Add a calendar
        calendars.push({
          id: serviceId,
          start_date: startDate,
          end_date: endDate,
          monday: trip.days.includes(CalendarDayEnum.monday) ? 1 : 0,
          tuesday: trip.days.includes(CalendarDayEnum.tuesday) ? 1 : 0,
          wednesday: trip.days.includes(CalendarDayEnum.wednesday) ? 1 : 0,
          thursday: trip.days.includes(CalendarDayEnum.thursday) ? 1 : 0,
          friday: trip.days.includes(CalendarDayEnum.friday) ? 1 : 0,
          saturday: trip.days.includes(CalendarDayEnum.saturday) ? 1 : 0,
          sunday: trip.days.includes(CalendarDayEnum.sunday) ? 1 : 0,
        });

        // Add added date to exceptions
        const gradeIds = trip.grades.map((grade) => grade.id as number);

        const newExceptionDates = GtfsUtils.getAddedDateExceptions(
          serviceId,
          gradeIds,
          calendarDates
        );

        newExceptionDates.forEach((newExceptionDate) =>
          calendarDates.push(newExceptionDate)
        );

        // Add vacations to exceptions
        const periodIds = getSchools()
          .flatMap((school) => school.grades)
          .filter((_grade) => gradeIds.includes(_grade.id as number))
          .map(
            (grade) =>
              (grade.calendar as CalendarType).calendarPeriodId as number
          );

        const newVacationsExceptionsDate = GtfsUtils.getVacationsExceptions(
          periodIds,
          serviceId,
          calendarDates
        );

        newVacationsExceptionsDate.forEach((newExceptionDate) =>
          calendarDates.push(newExceptionDate)
        );

        // Add public holidays to exceptions
        const newPublicHolidayExceptionDates =
          GtfsUtils.getPublicHolidaysExceptions(
            periodIds,
            serviceId,
            calendarDates
          );

        newPublicHolidayExceptionDates.forEach((newExceptionDate) =>
          calendarDates.push(newExceptionDate)
        );
      }
    });

    return { calendars, calendarDates };
  }

  export function getPublicHolidaysExceptions(
    periodIds: number[],
    serviceId: number,
    calendarDates: GtfsCalendarDatesType[]
  ): GtfsCalendarDatesType[] {
    const newCalendarDates: GtfsCalendarDatesType[] = [];

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
    calendarDates: GtfsCalendarDatesType[]
  ): GtfsCalendarDatesType[] {
    const newCalendarDates: GtfsCalendarDatesType[] = [];

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
    calendarDates: GtfsCalendarDatesType[]
  ): GtfsCalendarDatesType[] {
    const newCalendarDates: GtfsCalendarDatesType[] = [];

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
    calendarDate: GtfsCalendarDatesType,
    calendarDates: GtfsCalendarDatesType[]
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
