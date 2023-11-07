import {
  CalendarDayEnum,
  CalendarType,
} from "../../../_entities/calendar.entity";

export namespace CalendarUtils {
  export function getMonthName(date: Date): string {
    return date.toLocaleString("default", {
      month: "long",
    });
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

  export function stringListToDateTimeList(dates: string[]): number[] {
    const output: number[] = [];
    dates.forEach((date) => {
      output.push(stringToDate(date).getTime());
    });
    return output;
  }

  export function dateTimeListToStringList(dates: number[]): string[] {
    const output: string[] = [];
    dates.forEach((date) => {
      const bufferDate = new Date(date);
      output.push(
        `${bufferDate.getFullYear()}-${
          bufferDate.getMonth() + 1
        }-${bufferDate.getDate()}`
      );
    });
    return output;
  }

  export function stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  export function isHoliday(date: Date): boolean {
    const frenchHolidays = CalendarUtils.getFrenchHolidays(date.getFullYear());

    let isHoliday = false;
    for (const holiday of frenchHolidays) {
      const holidayDate = new Date(holiday);
      if (CalendarUtils.compareDate(holidayDate, date)) {
        isHoliday = true;
      }
    }
    return isHoliday;
  }

  export function isActiveDay(
    date: Date,
    calendar: CalendarType,
    log = false
  ): boolean {
    const isDateInRule = calendar.rules.includes(
      CalendarUtils.getDayName(date, true) as CalendarDayEnum
    );
    if (log) {
      console.log("in added date:", calendar.added.includes(date.getTime()));
      console.log("is holiday:", CalendarUtils.isHoliday(date));
      console.log("is weekend:", CalendarUtils.isWeekend(date));
      console.log("is date in rule:", isDateInRule);
      console.log(
        "is date deleted:",
        calendar.deleted.includes(date.getTime())
      );
    }

    if (calendar.added.includes(date.getTime())) return true;
    // TODO review holidays
    // if (CalendarUtils.isHoliday(date)) return false;
    if (CalendarUtils.isWeekend(date)) return false;
    if (!isDateInRule) return false;
    if (calendar.deleted.includes(date.getTime())) return false;

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

  export function getFrenchHolidays(year: number): Date[] {
    const holidays: Date[] = [];
    const paque = calculPaque(year);

    //TODO génère une erreur sur les lundi de décembre de Janvier
    holidays.push(new Date(`${year}-01-01`)); // Jour de l'An
    holidays.push(new Date(`${year}-05-01`)); // Fête du Travail
    holidays.push(new Date(`${year}-05-08`)); // Victoire 1945
    holidays.push(new Date(`${year}-07-14`)); // Fête Nationale (14 juillet)
    holidays.push(new Date(`${year}-08-15`)); // Assomption
    holidays.push(new Date(`${year}-11-01`)); // Toussaint
    holidays.push(new Date(`${year}-11-11`)); // Armistice 1918
    holidays.push(new Date(`${year}-12-25`)); // Noël
    holidays.push(paque); // Pâques
    return holidays;
  }

  function calculPaque(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }

  export function isDateAddedDate(date: Date, calendar: CalendarType) {
    if (calendar.added.includes(date.getTime())) return true;
    return false;
  }
}
