import { For, createSignal } from "solid-js";
export const [currentOrganisation, setCurrentOrganisation] = createSignal<any>(
  []
);
export type SelectorType = {
  selectorTitle: string;
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
      name="select"
      onChange={(e) => props.onChange(e)}
      disabled={props.disabled ?? false}
      class="selection"
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
