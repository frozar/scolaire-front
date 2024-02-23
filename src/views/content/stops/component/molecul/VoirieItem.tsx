import {
  Accessor,
  Setter,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { OsrmService, weight } from "../../../../../_services/osrm.service";
import CheckIcon from "../../../../../icons/CheckIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setWays } from "../../../map/Map";
import {
  getSelectedWay,
  setSelectedWay,
} from "../../../map/component/molecule/LineWeight";
import { minuteToTime } from "../organism/VoirieDay";
import { newWeigth } from "../organism/VoirieItems";
const [, { getActiveMapId }] = useStateGui();
interface CalendarItem {
  weight: weight;
  way_id: number;
  setNewWeigth?: Setter<weight>;
  isInMove?: Accessor<boolean>;
}

export function VoirieItem(props: CalendarItem) {
  const [style, setstyle] = createSignal<string>("");
  const [classe, setclasse] = createSignal<string>("");

  onMount(() => {
    console.log("props", props);
  });

  createEffect(() => {
    const val = props.weight.start / 5 + 2; // explication du calcul (h/60)*12+2 => (h/60)*pas+init => simplification
    const displayBlock = (props.weight.end - props.weight.start) / 5;
    setstyle("grid-row: " + val + " / span " + Math.min(displayBlock, 287));
    props.isInMove
      ? setclasse("relative mt-px flex " + (props.isInMove() ?? "disabled"))
      : console.log("Impossible to modify item size");
  });

  function onRangeChange(
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ): void {
    props.setNewWeigth
      ? props.setNewWeigth((current) => {
          return { ...current, weight: parseInt(e.target.value) };
        })
      : console.log("Impossible to set current weight");

    console.log(newWeigth());
  }

  function itemAddOrUpdate(): void {
    OsrmService.setWeight(
      props.way_id,
      props.weight.weight,
      props.weight.start,
      props.weight.end
    );
    console.log("la");
    setSelectedWay((step) => {
      if (step) {
        return {
          ...step,
          flaxib_weight: step.flaxib_weight.map((elem) => {
            if (
              elem.end == props.weight.end &&
              props.weight.start == elem.start
            ) {
              return { ...elem, weight: props.weight.weight };
            }
            return elem;
          }),
        };
      }
    });
    const newval = getSelectedWay();
    console.log(getSelectedWay());
    if (newval) {
      setWays((ways) => {
        return [
          ...ways.filter((step) => step.flaxib_way_id != props.way_id),
          newval,
        ];
      });
    }
    return console.log("onClick");
  }

  function itemDelete(): void {
    OsrmService.deleteWeight(
      props.way_id,
      props.weight.start,
      props.weight.end
    );

    setWays((ways) => {
      return ways.filter((step) => step.flaxib_way_id != props.way_id);
    });
    console.log("ici");

    setSelectedWay();
  }

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
          {minuteToTime(props.weight.start)}-{minuteToTime(props.weight.end)}
        </p>
        <div style={{ width: "45%" }} draggable={false}>
          <input
            onInput={(e) => onRangeChange(e)}
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
        <ButtonIcon
          icon={<CheckIcon />}
          onClick={() => itemAddOrUpdate()}
          class="text-blue-700 text-sm ml-2 mt-0 h-5"
        />
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => itemDelete()}
          class="text-blue-700 text-sm ml-2 mt-0 h-5"
        />
      </a>
    </li>
  );
}
