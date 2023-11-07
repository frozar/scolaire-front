import { Show } from "solid-js";
import "./CalendarSectionTitle.css";

export function CalendarSectionTitle(props: {
  title: string;
  greenTitle?: string;
}) {
  return (
    <p class="calendar-edition-title">
      {props.title}
      <Show when={props.greenTitle != undefined}>
        <span class="calendar-edition-title-active">
          {" " + props.greenTitle}
        </span>
      </Show>
    </p>
  );
}
