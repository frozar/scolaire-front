import { For } from "solid-js";
import "./Selector.css";

export type SelectorType = {
  id ?: string;
  content: { value: number; name: string }[];
  disabled: boolean;
  selectedValue: number;
  onChange: (
    res: Event & {
      currentTarget: HTMLSelectElement;
      target: HTMLSelectElement;
    }
  ) => void;
};

export function Selector(props: SelectorType) {
  return (
    <select
      id={props.id ?? props.id}
      class="selector"
      name="select"
      onChange={(e) => props.onChange(e)}
      disabled={props.disabled ?? false}
    >
      <For each={props.content}>
        {(elem) => (
          <option
            selected={elem.value == props.selectedValue}
            value={elem.value}
          >
            {elem.name}
          </option>
        )}
      </For>
    </select>
  );
}
