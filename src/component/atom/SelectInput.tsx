import { For, Show, createEffect, mergeProps } from "solid-js";
import "./SelectInput.css";

interface SelectInputProps {
  defaultValue?: number | string;
  onChange: (value: number | string) => void;
  options: { text: string; value: string | number }[];
  defaultOptions?: string;
  disabled?: boolean;
  indented?: boolean;
}

export function SelectInput(props: SelectInputProps) {
  const mergedProps = mergeProps({ disabled: false, indented: false }, props);
  function onChange(event: Event & { target: HTMLSelectElement }) {
    props.onChange(event.target.value);
  }

  // TODO: Fix: default value for scholar period of a calendar
  createEffect(() => {
    if (
      !mergedProps.disabled &&
      props.defaultValue == -1 &&
      props.options.length > 0
    ) {
      props.onChange(props.options[0].value);
    }
  });

  // TODO: Specify string to display when defaultValue == -1 within props
  return (
    <Show
      when={!mergedProps.disabled}
      fallback={
        <div
          class={"selector-disabled "}
          classList={{ "selector-indented": mergedProps.indented }}
        >
          {props.defaultValue == -1
            ? "Pas de calendrier séléctionné"
            : props.options.filter(
                (option) => option.value == props.defaultValue
              )[0].text}
        </div>
      }
    >
      <select onChange={onChange} class="selector">
        <Show when={props.options.length == 0}>
          <option value="default">{props.defaultOptions ?? "Options"}</option>
        </Show>
        <For each={props.options}>
          {(opt) => (
            <option
              value={opt.value}
              selected={props.defaultValue == opt.value}
            >
              {opt.text}
            </option>
          )}
        </For>
      </select>
    </Show>
  );
}
