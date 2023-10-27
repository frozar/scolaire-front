import { CalendarType } from "./template/Calendar";

export namespace CalendarUtils {
  export function getMonthName(date: Date): string {
    return date.toLocaleString("default", {
      month: "long",
    });
  }

  export function getDaysOfMonth(date: Date): number[] {
    const days = [];
    const numberOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();
    for (let i = 1; i <= numberOfDay; i++) {
      days.push(i);
    }
    return days;
  }

  export function getNameDay(date: Date): string {
    return date.toLocaleString("en-EN", {
      weekday: "long",
    });
  }

  export function stringToDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-");
    return new Date(Number(year), Number(month), Number(day));
  }

  export function isHoliday(date: Date): boolean {
    let isHoliday = false;
    CalendarUtils.getFrenchHolidays(date.getFullYear()).map((feriesDate) => {
      if (CalendarUtils.compareDate(feriesDate, date)) {
        isHoliday = true;
      }
    });
    return isHoliday;
  }

  export function getActifDaysOfMonth(
    calendar: CalendarType,
    month: Date
  ): Date[] {
    const days: Date[] = [];

    calendar.date_added.map((strDate) => {
      const date = CalendarUtils.stringToDate(strDate);
      const dayName = CalendarUtils.getNameDay(date).toLowerCase();

      if (
        date.getMonth() == month.getMonth() &&
        !calendar.date_deleted.includes(strDate) &&
        !CalendarUtils.isHoliday(date) &&
        !CalendarUtils.isWeekend(date) &&
        calendar.rules.includes(dayName)
      ) {
        days.push(date);
      }
    });
    return days;
  }

  export function isWeekend(date: Date): boolean {
    const dayName = CalendarUtils.getNameDay(date).toLowerCase();
    return dayName == "saturday" || dayName == "sunday";
  }

  export function compareDate(date: Date, toCompare: Date): boolean {
    if (
      date.getFullYear() == toCompare.getFullYear() &&
      date.getMonth() == toCompare.getMonth() &&
      CalendarUtils.getNameDay(date) == CalendarUtils.getNameDay(toCompare)
    )
      return true;
    else return false;
  }

  export function getFrenchHolidays(year: number): Date[] {
    const holidays: Date[] = [];
    const paque = calculPaque(year);

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

  // Fonction pour calculer la date de Pâques (Méthode de Gauss)
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
}
