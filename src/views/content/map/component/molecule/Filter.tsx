import { Accessor, Setter, createSignal } from "solid-js";
import "./Filter.css";

interface FilterProps {
  title: string;
  getter: Accessor<boolean>;
  setter: Setter<boolean>;
}

export function Filter(props: FilterProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ref, setRef] = createSignal<HTMLInputElement>();

  return (
    <div class="flex items-center">
      {props.title}
      <label class="filter-switch">
        <input
          ref={(e) =>
            setRef(() => {
              if (!props.getter()) return e;
              else {
                e.checked = true;
                return e;
              }
            })
          }
          type="checkbox"
          onChange={() => props.setter((prev) => (prev ? false : true))}
        />
        <span class="filter-slider" />
      </label>
    </div>
  );
}
