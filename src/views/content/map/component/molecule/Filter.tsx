import { Accessor, Setter, onMount } from "solid-js";
import "./Filter.css";

interface FilterProps {
  title: string;
  getter: Accessor<boolean>;
  setter: Setter<boolean>;
}
let ref: HTMLInputElement;

export function Filter(props: FilterProps) {
  onMount(() => {
    if (props.getter()) {
      ref.checked = true;
    }
  });

  return (
    <div>
      {props.title}
      <label class="switch">
        <input
          ref={ref}
          type="checkbox"
          onChange={() => props.setter((prev) => (prev ? false : true))}
        />
        <span class="slider round" />
      </label>
    </div>
  );
}
