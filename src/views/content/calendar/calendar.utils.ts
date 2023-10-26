import { MonthType } from "./template/Calendar";

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
}

export function getAllMonthsAndDays(year: number) {
  const monthsData = [];

  for (let month = 0; month < 12; month++) {
    const monthData: MonthType = {
      month: month + 1,
      monthName: new Date(year, month, 1).toLocaleString("default", {
        month: "long",
      }),
      days: [],
    };

    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= lastDay; day++) {
      monthData.days.push(day);
    }

    monthsData.push(monthData);
  }

  return monthsData as [];
}
