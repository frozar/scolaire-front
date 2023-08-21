import { Setter } from "solid-js";

import "./Checkbox.css";

interface CheckboxProps {
  ariaDescribedby: string;
  ref: Setter<HTMLInputElement>;
  onChange: (
    e: Event & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) => void;
  name: string;
}

export default function (props: CheckboxProps) {
  return (
    <input
      aria-describedby={props.ariaDescribedby}
      onChange={(e) => props.onChange(e)}
      name={props.name}
      ref={props.ref}
      class="checkbox"
      type="checkbox"
    />
  );
}
