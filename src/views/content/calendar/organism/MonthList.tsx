import { For } from "solid-js";
import { MonthType } from "./Calendar";
import MonthItem from "./MonthItem";

export default function (props: { months: MonthType[] }) {
  return (
    <For each={props.months}>{(month) => <MonthItem month={month} />}</For>
  );
}
