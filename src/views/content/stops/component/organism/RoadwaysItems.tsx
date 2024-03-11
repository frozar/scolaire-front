import { min } from "lodash";
import { For, Show, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import { getSelectedWays } from "../../../map/component/molecule/LineWeight";
import { RoadwaysItem } from "../molecul/RoadwaysItem";
import {
  isInMove,
  multipleWeight,
  newWeigth,
  setisInMove,
  setnewWeigth,
} from "./Roadways";
import { yToHourInMinutes } from "./RoadwaysDay";
import "./RoadwaysDay.css";

export default function RoadwaysItems() {
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
      <Show when={getSelectedWays().length === 1}>
        <For each={getSelectedWays()[0].flaxib_weight}>
          {(weight) => (
            <Show
              when={
                !(
                  weight.weight == 100 &&
                  weight.start == 0 &&
                  weight.end == 1439
                ) //Default value return by database when none weight associated
              }
            >
              {existingWeight(weight)}
            </Show>
          )}
        </For>
      </Show>

      <Show when={getSelectedWays().length > 1}>
        <For each={multipleWeight()}>
          {(weight) => (
            <Show
              when={
                !(
                  weight.weight == 100 &&
                  weight.start == 0 &&
                  weight.end == 1439
                ) //Default value return by database when none weight associated
              }
            >
              {existingWeight(weight)}
            </Show>
          )}
        </For>
      </Show>

      <Show when={newWeigth().start != -1 && getSelectedWays().length > 0}>
        <RoadwaysItem
          weight={newWeigth()}
          isInMove={isInMove}
          setNewWeigth={setnewWeigth}
          isOnDrawMode={true}
        />
      </Show>
    </ol>
  );
}

function existingWeight(weightValue: weight) {
  const [weigth, setWeigth] = createSignal<weight>(weightValue);

  return (
    <RoadwaysItem
      weight={weigth()}
      setNewWeigth={setWeigth}
      isInMove={isInMove}
      isOnDrawMode={false}
    />
  );
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

export function getConflictWays() {
  return getSelectedWays()
    .flatMap((way) => {
      return way.flaxib_weight.flatMap((weig) => {
        return { flaxib_way_id: way.flaxib_way_id, weight: weig };
      });
    })
    .filter(
      (weightElem) =>
        weightElem.weight.start != 0 && weightElem.weight.end != 1439
    )
    .filter((weight) => isSupperposed(newWeigth(), weight.weight));
}

function isSupperposed(a: weight, b: weight) {
  if (a.start == b.start || a.end == b.end) return true;

  const ordered = min([a.start, b.start]) == a.start ? [a, b] : [b, a];

  if (ordered[1].start > ordered[0].end) return false;

  return true;
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
function mouseDownInformation(e: { [x: string]: any; offsetY: number }) {
  e.preventDefault();

  const yToHour = yToHourInMinutes(e.offsetY);
  setisInMove(true);
  setnewWeigth({
    weight: 100,
    start: yToHour * 60,
    end: 30 + yToHour * 60,
  });
}
