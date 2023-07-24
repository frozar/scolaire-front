import "./ColorPicker.css";

export interface ColorPickeProps {
  color: string;
  title: string;

  onInput: (color: string) => void;
  onChange: (color: string) => void;
}

export function ColorPicker(props: ColorPickeProps) {
  return (
    <div class="color-picker">
      {props.title}
      <input
        type="color"
        value={props.color}
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
