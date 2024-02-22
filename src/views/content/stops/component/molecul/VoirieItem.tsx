import { Accessor, createEffect, createSignal } from "solid-js";
import CheckIcon from "../../../../../icons/CheckIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { minuteToTime } from "../organism/VoirieDay";

interface CalendarItem {
  h1: number; h2: number;ponderation:number;isInMove: Accessor<boolean>;
}

export function VoirieItem(props:CalendarItem) {
  const [dragVal, setdragVal] = createSignal<number>(100);
  const [style, setstyle] = createSignal<string>("");
  const [classe, setclasse] = createSignal<string>("");

  createEffect(() =>{
  
  const val = props.h1 / 5 + 2; // explication du calcul (h/60)*12+2 => (h/60)*pas+init => simplifier
  const displayBlock = (props.h2 - props.h1) / 5;
  setstyle("grid-row: " + val + " / span " + Math.min(displayBlock, 287));
  setclasse("relative mt-px flex " + (props.isInMove() ? "disabled" : ""));}
  )


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
      class={classe()}
      style={style()}
    >
      <a
        draggable={false}
        href="#"
        class="group absolute inset-0 flex rounded-lg bg-blue-100 p-1 leading-5 text-blue-700"
        style={{ "font-size": "xx-small", width: "15.5rem" }}
      >
        <p class="mr-1  pt-0">
          {minuteToTime(props.h1)}-{minuteToTime(props.h2)}
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
          <label for="cowbell">{props.ponderation}</label>
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