import { For } from "solid-js";
import MonthItem from "../molecule/MonthItem";

export default function (props: { month: Date }) {
  return (
    <For each={[0, 1, 2]}>
      {(index) => (
        <MonthItem
          month={
            new Date(props.month.getFullYear(), props.month.getMonth() + index)
          }
        />
      )}
    </For>
  );
}
