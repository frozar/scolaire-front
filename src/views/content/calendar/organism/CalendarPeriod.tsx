import { For, Show } from "solid-js";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";
import { onCalendarsPeriod } from "../template/Calendar";
import { CalendarHeader } from "./CalendarHeader";

interface SchoolCalendarProps {
  date: Date;
}

export function CalendarPeriod(props: SchoolCalendarProps) {
  return (
    <section class="mt-10">
      <p class="text-2xl">Calendrier scolaire</p>
      <CalendarHeader month={props.date} />

      <Show when={onCalendarsPeriod() != undefined}>
        <div class="calendar-cells ml-[100px]">
          <For each={[0, 1, 2]}>
            {(index) => (
              <div class="calendar-month-details">
                <For
                  each={CalendarUtils.getDaysOfMonth(
                    new Date(
                      props.date.getFullYear(),
                      props.date.getMonth() + index
                    )
                  )}
                >
                  {(date) => (
                    <CellItem
                      isActive={false}
                      isWeekend={CalendarUtils.isWeekend(date)}
                      onClick={() => {
                        console.log(date);
                      }}
                      outPeriod={
                        !CalendarUtils.dayIsInPeriod(
                          date,
                          onCalendarsPeriod() as CalendarPeriodType
                        )
                      }
                    />
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </Show>
    </section>
  );
}
