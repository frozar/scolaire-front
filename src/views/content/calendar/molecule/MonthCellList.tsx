import { For } from "solid-js";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import { CalendarType } from "../template/Calendar";
import "./MonthCellList.css";

const stringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-");
  return new Date([month, day, year].join("/"));
};

export function MonthCellList(props: { month: Date; calendar: CalendarType }) {
  return (
    <div class="month-item">
      <div class="month-item-cells">
        <For each={CalendarUtils.getDaysOfMonth(props.month)}>
          {(day) => {
            const currentDate = () =>
              new Date(props.month.getFullYear(), props.month.getMonth(), day);

            const dayFullName = () =>
              CalendarUtils.getNameDay(currentDate()).toLowerCase();

            const isWeekend = () =>
              dayFullName() == "saturday" || dayFullName() == "sunday";

            // Véifie si la date de la cellule fait parti des jours autorisé
            const isDateInRules = () =>
              props.calendar.rules.includes(dayFullName());

            // Vérifie si la date de la cellule fait parti des dates ou il n'y pas d'activité
            const isDeletedDate = () => {
              let isDeleted = false;
              props.calendar.dated_deleted.map((dateDeleted) => {
                const date = stringToDate(dateDeleted);
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
                const addedDate = stringToDate(date);
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
              <CellItem
                isActive={isActive()}
                isWeekend={isWeekend()}
                onClick={onClick}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}
