import { CalendarDayEnum } from "./calendar.entity";

export namespace FlatGraphicEntity {
  export function build(dbGraphic: FlatGraphicDBType): FlatGraphicType {
    return {
      id: dbGraphic.id,
      name: dbGraphic.name,
      color: dbGraphic.color,
      days: dbGraphic.days.map((day) => day as CalendarDayEnum),
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
