import { ColorPicker } from "../atom/ColorPicker";

export interface TripColorPickeProps {
  defaultColor?: string;
  onChange: (color: string) => void;
}

export function TripColorPicker(props: TripColorPickeProps) {
  return (
    <div class="color-picker">
      <ColorPicker
        defaultColor={props.defaultColor}
        title="Couleur de la trip"
        onInput={props.onChange}
        onChange={props.onChange}
      />
    </div>
  );
}
