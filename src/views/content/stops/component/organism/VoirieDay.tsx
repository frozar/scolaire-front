import { For } from "solid-js";
import { getSelectedWays } from "../../../map/component/molecule/LineWeight";
import { VoirieTimeItem } from "../atom/VoirieTimeItem";
import "./VoirieDay.css";
import VoirieItems from "./VoirieItems";

export default function VoirieDay() {
  return (
    <div class="flex h-full flex-col">
      <header class="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h1 class="text-base font-semibold leading-6 text-gray-900">
            <p class="mt-1 text-sm sm:inline ">Pondération</p>
          </h1>
        </div>
        <div class="flex items-center" />
      </header>
      {/* FIN DU HEADER */}

      <div class="isolate flex flex-auto overflow-hidden bg-white voirie-day-content">
        <div class="flex flex-auto flex-col overflow-auto">
          <div class="flex w-full flex-auto">
            <div class="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div class="grid flex-auto grid-cols-1 grid-rows-1">
              {/* <!-- Horizontal lines --> */}
              <div
                class="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={
                  "grid-template-rows: repeat(" +
                  24 * 2 +
                  ", minmax(1.5rem, 1fr))"
                }
              >
                {/* <!-- Hours --> */}
                <div class="row-end-1 h-7" />
                <For each={[...Array(24).keys()]}>
                  {(opt) => <VoirieTimeItem opt={opt} />}
                </For>
              </div>

              {/* <!-- Ponderation --> */}
              <VoirieItems
                flaxib_weight={getSelectedWays()[0]?.flaxib_weight ?? []}
                flaxib_way_id={getSelectedWays()[0]?.flaxib_way_id ?? -1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function yToHourInMinutes(offsetY: number) {
  const val = Math.round(23.5 * (offsetY / 12 / 100) * 2) * 0.5;
  const yToHour = val - (val < 10 ? 0.5 : 0);
  return yToHour;
}

// function getClickInformation(e: { offsetY: number }) {
//   const yToHour = yToHourInMinutes(e.offsetY);
//   setCurrentWeigth({ weight: 10, start: yToHour * 60, end: 30 + yToHour * 60 });
//   return;
// }

export function minuteToTime(h: number, isForPoderationListe = false) {
  if (h == 0) {
    return isForPoderationListe ? "12AM" : "12:00AM";
  }
  let hour = Math.trunc(h / 60);
  const min = h - hour * 60;

  hour = hour % 12;
  const ampm = (hour === 0 && min === 0) || hour > 12 ? "PM" : "AM";

  if (isForPoderationListe) {
    return hour + ampm;
  } else {
    return hour + ":" + (min < 10 ? "0" : "") + min + ampm;
  }
}
