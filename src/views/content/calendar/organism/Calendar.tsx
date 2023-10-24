import { createSignal, onMount } from "solid-js";
import LeftChevronIcon from "../../../../icons/LeftChevronIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./Calendar.css";
import MonthList from "./MonthList";
import { getAllMonthsAndDays } from "./calendar.utils";

export type MonthType = {
  month: number;
  monthName: string;
  days: number[];
};

export default function () {
  let displayIndex = 3;
  let months: MonthType[] = [];
  const [displayMonths, setDisplayMonths] = createSignal<MonthType[]>([]);

  onMount(() => {
    const currentYear = new Date().getFullYear();
    months = getAllMonthsAndDays(currentYear);
    getMonths();
  });

  function getMonths() {
    let first = 0;
    if (displayIndex == 4) first = 1;
    if (displayIndex == 5) first = 2;
    if (displayIndex == 6) first = 3;
    if (displayIndex == 7) first = 4;
    if (displayIndex == 8) first = 5;
    if (displayIndex == 9) first = 6;
    if (displayIndex == 10) first = 7;
    if (displayIndex == 11) first = 8;
    if (displayIndex == 12) first = 9;

    setDisplayMonths(() => months.slice(first, displayIndex));
  }

  function nextMonth() {
    if (displayIndex == 12) displayIndex = 3;
    else displayIndex += 1;
    getMonths();
  }

  function previousMonth() {
    if (displayIndex <= 3) displayIndex = 12;
    else displayIndex -= 1;
    getMonths();
  }

  return (
    <section class="page-layout">
      <p class="page-title">Gestion des calendriers</p>

      <div class="months-container">
        <ButtonIcon
          icon={<LeftChevronIcon />}
          onClick={previousMonth}
          class="month-next-button"
        />
        <div class="month-list-wrapper">
          <MonthList months={displayMonths()} />
        </div>
        <ButtonIcon
          icon={<LeftChevronIcon />}
          onClick={nextMonth}
          class="month-next-button rotate-180"
        />
      </div>
    </section>
  );
}
