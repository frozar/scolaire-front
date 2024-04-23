import { CalendarDayEnum } from "../../../../_entities/calendar.entity";
import { FlatGraphicType } from "../../../../_entities/flatGraphic.entity";
import "./FlatGraphicAddMenuDays.css";

interface FlatGraphicAddMenuDaysProps {
  graphic?: FlatGraphicType;
  onChange: (number: number) => void;
}

export function FlatGraphicAddMenuDays(props: FlatGraphicAddMenuDaysProps) {
  function isChecked(day: CalendarDayEnum) {
    if (props.graphic?.days) {
      if (props.graphic.days.includes(day)) return true;
      return false;
    }
    return false;
  }

  return (
    <div class="days-container">
      <div class="days-item">
        <p>Lundi</p>
        <input
          type="checkbox"
          checked={isChecked(CalendarDayEnum.monday)}
          onChange={() => props.onChange(0)}
        />
      </div>
      <div class="days-item">
        <p>Mardi</p>
        <input
          type="checkbox"
          checked={isChecked(CalendarDayEnum.tuesday)}
          onChange={() => props.onChange(1)}
        />
      </div>
      <div class="days-item">
        <p>Mercredi</p>
        <input
          type="checkbox"
          checked={isChecked(CalendarDayEnum.wednesday)}
          onChange={() => props.onChange(2)}
        />
      </div>
      <div class="days-item">
        <p>Jeudi</p>
        <input
          type="checkbox"
          checked={isChecked(CalendarDayEnum.thursday)}
          onChange={() => props.onChange(3)}
        />
      </div>
      <div class="days-item">
        <p>Vendredi</p>
        <input
          type="checkbox"
          checked={isChecked(CalendarDayEnum.friday)}
          onChange={() => props.onChange(4)}
        />
      </div>
      <div class="days-item">
        <p>Samedi</p>
        <input
          type="checkbox"
          checked={isChecked(CalendarDayEnum.saturday)}
          onChange={() => props.onChange(5)}
        />
      </div>
    </div>
  );
}
