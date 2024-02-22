import { For, Show, createSignal } from "solid-js";
import { weight } from "../../../../../_services/osrm.service";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
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
                      {eventItem(weight.start, weight.end)}
                    </Show>
                  )}
                </For>
                <Show when={currentWeigth().start != -1}>
                  {eventItem(
                    currentWeigth().start,
                    currentWeigth().end
                  )}
                </Show>
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

// function getClickInformation(e: { offsetY: number }) {
//   const yToHour = yToHourInMinutes(e.offsetY);
//   setCurrentWeigth({ weight: 10, start: yToHour * 60, end: 30 + yToHour * 60 });
//   return;
// }
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

function CalendarItem(opt: number) {
  return (
    <>
      <div>
        <div class="-ml-16 -mt-2.5 w-12 pr-2 text-right text-xs leading-5 text-gray-400">
          {minuteToTime(opt * 60, true)}
        </div>
      </div>
      <div />
    </>
  );
}

function eventItem(h1: number, h2: number) {
  const h1ToTime = minuteToTime(h1);
  const h2ToTime = minuteToTime(h2);

  const val = h1 / 5 + 2; // explication du calcul (h/60)*12+2 => (h/60)*pas+init => simplifier
  const displayBlock = (h2 - h1) / 5;
  const style = "grid-row: " + val + " / span " + Math.min(displayBlock, 287);
  const classe = "relative mt-px flex " + (isInMove() ? "disabled" : "");

  const [dragVal, setdragVal] = createSignal<number>(100);
  return (
    <li
      onMouseDown={(e) => {
        e.preventDefault;
        e.stopPropagation();
      }}
      onMouseMove={(e) => {
        e.preventDefault;
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.preventDefault;
      }}
      class={classe}
      style={style}
    >
      <a
        draggable={false}
        href="#"
        class="group absolute inset-0 flex rounded-lg bg-blue-100 p-1 leading-5 text-blue-700"
        style={{ "font-size": "xx-small", width: "15.5rem" }}
      >
        <p class="mr-1  pt-0">
          {h1ToTime}-{h2ToTime}
        </p>
        <div style={{ width: "50%" }} draggable={false}>
          <input
            onInput={(e) => setdragVal(parseInt(e.target.value) ?? 100)}
            onDragStart={(e) => {
              e.preventDefault();
              e.stopImmediatePropagation();
              console.log("drag");
            }}
            onMouseUp={(e) => {
              e.preventDefault();
              e.stopImmediatePropagation();
              console.log("dragend");
            }}
            type="range"
            min="0"
            max="100"
            value={dragVal()}
            step="10"
            draggable={true}
            style={{ width: "80%" }}
          />
          <label for="cowbell">{dragVal()}</label>
        </div>
        <ButtonIcon
          icon={<CheckIcon />}
          onClick={() => console.log("onClick")}
          class="text-blue-700 text-sm ml-2 mt-0 h-5"
        />
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
