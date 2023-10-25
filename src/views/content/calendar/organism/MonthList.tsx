import { For } from "solid-js";
import MonthItem from "../molecule/MonthItem";
import "./MonthList.css";

export default function (props: { month: Date }) {
  return (
    <div class="month-list-wrapper">
      <For each={[0, 1, 2]}>
        {(index) => (
          <MonthItem
            month={
              new Date(
                props.month.getFullYear(),
                props.month.getMonth() + index
              )
            }
          />
        )}
      </For>
    </div>
  );
}
