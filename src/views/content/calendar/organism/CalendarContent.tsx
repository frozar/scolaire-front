import { For } from "solid-js";
<div class="calendar-cells">
  <For each={props.month.days}>{() => <CellItem />}</For>
</div>;
