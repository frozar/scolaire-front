import { ColorPicker } from "../atom/ColorPicker";

export interface RaceColorPickeProps {
  defaultColor?: string;
  onChange: (color: string) => void;
}

export function RaceColorPicker(props: RaceColorPickeProps) {
  return (
    <div class="color-picker">
      <ColorPicker
        defaultColor={props.defaultColor}
        title="Couleur de la course"
        onInput={props.onChange}
        onChange={props.onChange}
      />
    </div>
  );
}
