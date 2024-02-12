import { For, Show, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import "./VoirieDay.css";
import { getSelectedWay } from "./WayDetails";

const [currentWeigth, setCurrentWeigth] = createSignal<weight>({
  weight: 10,
  start: 10,
  end: 110,
});

const [isInMove, setisInMove] = createSignal<boolean>(false);

export default function Calendar() {
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
                <div class="row-end-1 h-7" />
                <For each={[...Array(24).keys()]}>
                  {(opt) => CalendarItem(opt)}
                </For>
              </div>

              {/* <!-- Events --> */}
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
                      {eventItem(weight.start, weight.end, weight.weight)}
                    </Show>
                  )}
                </For>

                {eventItem(
                  currentWeigth().start,
                  currentWeigth().end,
                  currentWeigth().weight
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function yToHourInMinutes(offsetY: number) {
  const val = Math.round(23.5 * (offsetY / 12 / 100) * 2) * 0.5;
  const yToHour = val - (val < 10 ? 0.5 : 0);
  return yToHour;
}

function getClickInformation(e: { offsetY: number }) {
  const yToHour = yToHourInMinutes(e.offsetY);
  setCurrentWeigth({ weight: 10, start: yToHour * 60, end: 30 + yToHour * 60 });
  return;
}

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

function mouseUpInformation(e: { [x: string]: any; offsetY: number }) {
  e.preventDefault();

  setisInMove(false);

  return;
}

function mouseDownInformation(e: { [x: string]: any; offsetY: number }) {
  e.preventDefault();

  const yToHour = yToHourInMinutes(e.offsetY);
  console.log("mouse down");
  setisInMove(true);
  setCurrentWeigth({ weight: 10, start: yToHour * 60, end: 30 + yToHour * 60 });
  return;
}

function CalendarItem(opt: number) {
  return (
    <>
      <div>
        <div class="-ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
          {minuteToTime(opt * 60, true)}
        </div>
      </div>
      <div />
    </>
  );
}

function eventItem(h1: number, h2: number, ponderation = 100) {
  const h1ToTime = minuteToTime(h1);
  const h2ToTime = minuteToTime(h2);

  const val = h1 / 5 + 2; // explication du calcul (h/60)*12+2 => (h/60)*pas+init => factoriser
  const displayBlock = (h2 - h1) / 5;
  const style = "grid-row: " + val + " / span " + Math.min(displayBlock, 287);
  const classe = "relative mt-px flex " + (isInMove() ? "disabled" : "");
  console.log("classe", classe);
  return (
    <li class={classe} style={style}>
      <a
        href="#"
        class="group absolute inset-0 flex flex-col rounded-lg bg-blue-50 p-2 text-xs leading-5 "
      >
        <p class="order-1 font-semibold text-blue-700">
          {h1ToTime}-{h2ToTime} ={">"} pondération : {ponderation}
        </p>
        <div>
          <input
            type="range"
            id="cowbell"
            name="cowbell"
            min="0"
            max="100"
            value="90"
            step="10"
          />
          <label for="cowbell">Pondération</label>
        </div>
      </a>
    </li>
  );
}

function minuteToTime(h: number, isForPoderationListe = false) {
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
