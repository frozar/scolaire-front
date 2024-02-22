import { For, Show, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import { VoirieItem } from "../molecul/VoirieItem";
import { yToHourInMinutes } from "./VoirieDay";
import "./VoirieDay.css";
import { getSelectedWay } from "./WayDetails";

const [currentWeigth, setCurrentWeigth] = createSignal<weight>(defaultValue());

const [isInMove, setisInMove] = createSignal<boolean>(false);

function defaultValue(): weight {
  return {
    weight: 100,
    start: -1,
    end: -1,
  };
}
export const resetCurrentWeight = () => setCurrentWeigth(defaultValue());

export default function VoirieItems() {
  return (
              <ol
                onMouseDown={mouseDownInformation}
                onMouseMove={mouseMoveInformation}
                onMouseUp={mouseUpInformation}
                class="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{
                  "grid-template-rows":
                    "1.75rem repeat(288,  [col-start] minmax(0, 1fr) [col-end]) auto",
                }}
              >
                <For each={getSelectedWay()?.flaxib_weight}>
                  {(weight) => (
                    <Show when={weight.weight != 100}>
                  <VoirieItem h1={weight.start} h2={weight.end} ponderation={weight.weight} isInMove={isInMove}/>

                    </Show>
                  )}
                </For>
                <Show when={currentWeigth().start != -1}>
                  <VoirieItem h1={currentWeigth().start} h2={currentWeigth().end} ponderation={currentWeigth().weight} isInMove={isInMove}/>
                </Show>
              </ol>
           
  );
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function mouseMoveInformation(e: { [x: string]: any; offsetY: number }) {
  e.preventDefault();
  if (isInMove()) {
    const yToHour = yToHourInMinutes(e.offsetY);
    if (
      yToHour * 60 > currentWeigth().end - 60 &&
      yToHour * 60 < currentWeigth().end + 60
    ) {
      setCurrentWeigth((weight) => {
        const valEnd = Math.max(yToHour * 60, weight.start + 30);
        return { ...weight, end: valEnd };
      });
    }
  }
  return;
}
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function mouseUpInformation(e: { [x: string]: any; offsetY: number }) {
  e.preventDefault();

  setisInMove(false);

  return;
}
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function mouseDownInformation(e: { [x: string]: any; offsetY: number }) {
  e.preventDefault();

  const yToHour = yToHourInMinutes(e.offsetY);
  console.log("mouse down");
  setisInMove(true);
  setCurrentWeigth({
    weight: 100,
    start: yToHour * 60,
    end: 30 + yToHour * 60,
  });
  return;
}