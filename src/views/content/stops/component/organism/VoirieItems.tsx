import { min } from "lodash";
import { For, Show, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import { getSelectedWays } from "../../../map/component/molecule/LineWeight";
import { VoirieItem } from "../molecul/VoirieItem";
import { yToHourInMinutes } from "./VoirieDay";
import "./VoirieDay.css";

export const [newWeigth, setnewWeigth] = createSignal<weight>(
  defaultWeightValue()
);
export const [multipleWeight, setmultipleWeight] = createSignal<weight[]>([]);

const [isInMove, setisInMove] = createSignal<boolean>(false);

export function defaultWeightValue(): weight {
  return {
    weight: 100,
    start: -1,
    end: -1,
  };
}
export const resetNewWeight = () => setnewWeigth(defaultWeightValue());

interface VoirieItems {
  // flaxib_weight: weight[];
  // flaxib_way_id: number;
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
              {existingWeight(weight, getSelectedWays()[0].flaxib_way_id)}
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
              {existingWeight(weight, -1)}
            </Show>
          )}
        </For>
      </Show>

      <Show when={newWeigth().start != -1 && getSelectedWays().length > 0}>
        <VoirieItem
          weight={newWeigth()}
          isInMove={isInMove}
          setNewWeigth={setnewWeigth}
          isOnDrawMode={true}
        />
      </Show>
    </ol>
  );
}

function existingWeight(weightValue: weight, flaxib_way_id: number) {
  const [weigth, setWeigth] = createSignal<weight>(weightValue);

  return (
    <VoirieItem
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
