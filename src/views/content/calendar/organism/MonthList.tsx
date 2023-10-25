import { For } from "solid-js";
import MonthItem from "../molecule/MonthItem";
import { MonthType } from "./Calendar";

export default function (props: { months: MonthType[] }) {
  return (
    <For each={props.months}>{(month) => <MonthItem month={month} />}</For>
  );
}
