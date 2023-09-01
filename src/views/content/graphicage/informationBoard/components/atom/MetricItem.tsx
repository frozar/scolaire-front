import { createSignal } from "solid-js";
import "./MetricItem.css";

export interface MetricItemProps {
  title: string;
  value?: number;
  unite?: string;
}

export const [pickerColor, setPickerColor] = createSignal("");

export function MetricItem(props: MetricItemProps) {
  return (
    <div class="metric-item">
      {props.title} : {props.value ?? "-"} {props.value ? props.unite : ""}
    </div>
  );
}
