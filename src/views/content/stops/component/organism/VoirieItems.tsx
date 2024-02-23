import { For, Show, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import { VoirieItem } from "../molecul/VoirieItem";
import { yToHourInMinutes } from "./VoirieDay";
import "./VoirieDay.css";

export const [newWeigth, setnewWeigth] = createSignal<weight>(defaultValue());

const [isInMove, setisInMove] = createSignal<boolean>(false);

function defaultValue(): weight {
  return {
    weight: 100,
    start: -1,
    end: -1,
  };
}
export const resetCurrentWeight = () => setnewWeigth(defaultValue());

interface VoirieItems {
  flaxib_weight: weight[];
  flaxib_way_id: number;
}

export default function VoirieItems(props: VoirieItems) {
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
      <For each={props.flaxib_weight}>
        {(weight) => (
          <Show
            when={
              !(weight.weight == 100 && weight.start == 0 && weight.end == 1439) //Default value return by database when none weight associated
            }
          >
            {existingWeight(weight)}
          </Show>
        )}
      </For>
      <Show when={newWeigth().start != -1}>
        <VoirieItem
          weight={newWeigth()}
          way_id={props.flaxib_way_id}
          isInMove={isInMove}
          setNewWeigth={setnewWeigth}
        />
      </Show>
    </ol>
  );

  function existingWeight(weightValue: weight) {
    const [weigth, setWeigth] = createSignal<weight>(weightValue);

    return (
      <VoirieItem
        weight={weigth()}
        setNewWeigth={setWeigth}
        way_id={props.flaxib_way_id}
        isInMove={isInMove}
      />
    );
  }
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function mouseMoveInformation(e: { [x: string]: any; offsetY: number }) {
  e.preventDefault();
  if (isInMove()) {
    const yToHour = yToHourInMinutes(e.offsetY);
    if (
      yToHour * 60 > newWeigth().end - 60 &&
      yToHour * 60 < newWeigth().end + 60
    ) {
      setnewWeigth((weight) => {
        const valEnd = Math.max(yToHour * 60, weight.start + 30);
        return { ...weight, end: valEnd };
      });
    }
  }
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
  setnewWeigth({
    weight: 100,
    start: yToHour * 60,
    end: 30 + yToHour * 60,
  });
}
