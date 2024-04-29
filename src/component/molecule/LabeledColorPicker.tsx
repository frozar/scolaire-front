import { ColorPicker } from "../atom/ColorPicker";

export interface LabeledColorPickerProps {
  defaultColor?: string;
  onChange: (color: string) => void;
  text: string;
}

export function LabeledColorPicker(props: LabeledColorPickerProps) {
  return (
    <div class="color-picker">
      <ColorPicker
        defaultColor={props.defaultColor}
        title={props.text}
        onInput={props.onChange}
        onChange={props.onChange}
      />
    </div>
  );
}
