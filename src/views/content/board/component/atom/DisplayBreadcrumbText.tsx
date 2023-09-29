import { Show } from "solid-js";

export default function (props: { crumbIndex: number; text: string }) {
  return (
    <Show
      when={props.crumbIndex == 0}
      fallback={<p class="sub-crumb">{props.text}</p>}
    >
      <p>{props.text}</p>
    </Show>
  );
}
