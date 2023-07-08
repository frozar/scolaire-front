import { Setter } from "solid-js";
import "./Checkbox.css";
interface CheckboxProps {
  ariaDescribedby: string;
  ref: Setter<HTMLInputElement>;
  onChange: () => void;
  name: string;
}

export default function (props: CheckboxProps) {
  return (
    <input
      aria-describedby={props.ariaDescribedby}
      onChange={() => props.onChange()}
      name={props.name}
      ref={props.ref}
      class="checkbox"
      type="checkbox"
    />
  );
}
