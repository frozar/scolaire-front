import { createSignal } from "solid-js";
import "./ColorPicker.css";

export interface ColorPickeProps {
  title: string;

  onInput: (color: string) => void;
  onChange: (color: string) => void;
}

export const [pickerColor, setPickerColor] = createSignal("");

export function ColorPicker(props: ColorPickeProps) {
  return (
    <div class="color-picker">
      {props.title}
      <input
        type="color"
        value={pickerColor()}
        onInput={(e) => {
          props.onInput(e.target.value);
        }}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    </div>
  );
}
