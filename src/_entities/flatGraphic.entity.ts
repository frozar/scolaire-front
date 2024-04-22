import { CalendarDayEnum } from "./calendar.entity";

export namespace FlatGraphicEntity {
  export function build(dbGraphic: FlatGraphicDBType): FlatGraphicType {
    return {
      id: dbGraphic.id,
      name: dbGraphic.name,
      color: dbGraphic.color,
      days: setDays(dbGraphic.days),
    };
  }

  export function dbFormat(graphic: FlatGraphicType) {
    return {
      id: graphic.id,
      name: graphic.name,
      color: graphic.color,
      days: graphic.days,
    };
  }
}

export type FlatGraphicType = {
  id?: number;
  name: string;
  color: string;
  days: CalendarDayEnum[];
};

export type FlatGraphicDBType = {
  id?: number;
  name: string;
  color: string;
  days: string[];
};

function setDays(list: string[]) {
  const output: CalendarDayEnum[] = [];
  list.forEach((day) => {
    if (day == "monday") output.push(CalendarDayEnum.monday);
    if (day == "tuesday") output.push(CalendarDayEnum.tuesday);
    if (day == "wednesday") output.push(CalendarDayEnum.wednesday);
    if (day == "thursday") output.push(CalendarDayEnum.thursday);
    if (day == "friday") output.push(CalendarDayEnum.friday);
    if (day == "saturday") output.push(CalendarDayEnum.saturday);
    if (day == "sunday") output.push(CalendarDayEnum.sunday);
  });
  return output;
}
