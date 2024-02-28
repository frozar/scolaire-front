import { Setter } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
interface VoirieItemRangeElem {
  weight: weight;
  setNewWeigth: Setter<weight>;
}

export function VoirieItemRangeElem(props: VoirieItemRangeElem) {
  return (
    <div style={{ width: "45%" }} draggable={false}>
      <input
        onInput={(e) => onRangeChange(e, props.setNewWeigth)}
        onDragStart={(e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
        }}
        type="range"
        min="0"
        max="100"
        value={props.weight.weight}
        step="10"
        draggable={true}
        style={{ width: "80%" }}
      />
      <label for="cowbell">{props.weight.weight}</label>
    </div>
  );
}

function onRangeChange(
  e: InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
  },
  setNewWeigth: Setter<weight>
): void {
  setNewWeigth
    ? setNewWeigth((current) => {
        return { ...current, weight: parseInt(e.target.value) };
      })
    : console.log("Impossible to set current weight");
}
