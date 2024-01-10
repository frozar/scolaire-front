import { For } from "solid-js";

interface RulesSelectorWrapperProps {
  onChange: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  list: string[];
}

export function RulesSelectorWrapper(props: RulesSelectorWrapperProps) {
  return (
    <div class="flex items-center">
      <select
        disabled={props.disabled}
        onChange={(event) => props.onChange(event.target.value)}
        class="h-fit"
      >
        <For each={props.list}>
          {(enumeredElem) => (
            <option
              value={enumeredElem}
              selected={enumeredElem === props.defaultValue}
            >
              {enumeredElem}
            </option>
          )}
        </For>
      </select>
    </div>
  );
}
