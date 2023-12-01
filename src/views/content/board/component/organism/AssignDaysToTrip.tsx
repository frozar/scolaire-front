import { createEffect } from "solid-js";
import { CalendarDayEnum } from "../../../../../_entities/calendar.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { GradeUtils } from "../../../../../utils/grade.utils";
import { drawTripCheckableGrade } from "./DrawTripBoard";

export function AssignDaysToTrip() {
  let checked: GradeType[] = [];
  let commonDay: string[] = [];
  let rulesList: string[][] = [];

  function getCommonDay() {
    const calendars = checked.flatMap((item) => item.calendar);
    for (const calendar of calendars) {
      rulesList.push(calendar?.rules.map((item) => item.day) ?? []);
    }

    // * Create array flat mapped of every day of every rules
    const everyDayRule = rulesList.flatMap((item) => item.map((item) => item));
    const weekDays = Object.values(CalendarDayEnum);
    // * For each day of an week lets how many occurance of the day is in everyDayRule
    // * if occurance = grades.length so we have a common day
    weekDays.forEach((day) => {
      const occurance = everyDayRule.filter((item) => item == day).length;
      if (occurance == calendars.length) commonDay.push(day);
    });
  }

  createEffect(() => {
    checked = [];
    commonDay = [];
    rulesList = [];

    drawTripCheckableGrade().filter((item) => {
      if (item.done) checked.push(GradeUtils.getGrade(item.item.id));
    });

    getCommonDay();
    console.log("common day", commonDay);
  });

  return (
    <>
      <p>Jours assignées à la course</p>
    </>
  );
}
