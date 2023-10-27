import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import { CalendarType } from "../template/Calendar";

export function CellItemLogic(props: {
  month: Date;
  day: number;
  calendar: CalendarType;
}) {
  const currentDate = () =>
    new Date(props.month.getFullYear(), props.month.getMonth(), props.day);

  const dayFullName = () =>
    CalendarUtils.getNameDay(currentDate()).toLowerCase();

  const isWeekend = () =>
    dayFullName() == "saturday" || dayFullName() == "sunday";

  // Véifie si la date de la cellule fait parti des jours autorisé
  const isDateInRules = () => props.calendar.rules.includes(dayFullName());

  // Vérifie si la date de la cellule fait parti des dates ou il n'y pas d'activité
  const isDeletedDate = () => {
    let isDeleted = false;
    props.calendar.date_deleted.map((dateDeleted) => {
      const date = CalendarUtils.stringToDate(dateDeleted);
      if (date.getTime() == currentDate().getTime()) {
        isDeleted = true;
      }
    });
    return isDeleted;
  };

  // Vérifie si la date de la cellule fait parti des dates avec une activité
  const activeDate = () => {
    let isActive = false;
    props.calendar.date_added.map((date) => {
      const addedDate = CalendarUtils.stringToDate(date);
      if (addedDate.getTime() == currentDate().getTime()) {
        isActive = true;
      }
    });
    return isActive;
  };

  function isActive() {
    return isDateInRules() && activeDate() && !isDeletedDate();
  }

  function onClick() {
    console.log("Cell click, day:", dayFullName());
  }
  return (
    <CellItem isActive={isActive()} isWeekend={isWeekend()} onClick={onClick} />
  );
}
