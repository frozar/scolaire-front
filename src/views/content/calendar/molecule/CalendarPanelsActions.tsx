import Button from "../../../../component/atom/Button";
import {
  CalendarPanelEnum,
  onCalendarPanel,
  setOnCalendarPanel,
} from "../template/Calendar";

export function CalendarPanelsActions() {
  function changeCalendarPanel(panel: CalendarPanelEnum) {
    setOnCalendarPanel(panel);
  }
  return (
    <div class="calendar-panels-action">
      <Button
        label="Gestion des calendriers"
        onClick={() => changeCalendarPanel(CalendarPanelEnum.calendarManager)}
        active={onCalendarPanel() == CalendarPanelEnum.calendarManager}
        variant="borderless"
        size="3xl"
      />

      <Button
        label="Calendrier scolaire"
        onClick={() => changeCalendarPanel(CalendarPanelEnum.schoolCalendar)}
        active={onCalendarPanel() == CalendarPanelEnum.schoolCalendar}
        variant="borderless"
        size="3xl"
      />
    </div>
  );
}
