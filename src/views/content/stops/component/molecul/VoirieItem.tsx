import { Accessor, Setter, createEffect, createSignal } from "solid-js";
import { OsrmService, weight } from "../../../../../_services/osrm.service";
import CheckIcon from "../../../../../icons/CheckIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setWays } from "../../../map/Map";
import {
  getSelectedWay,
  setSelectedWay,
} from "../../../map/component/molecule/LineWeight";
import { VoirieItemRangeElem } from "../atom/VoirieItemRangeElem";
import { minuteToTime } from "../organism/VoirieDay";
interface VoirieItem {
  weight: weight;
  way_id: number;
  setNewWeigth: Setter<weight>;
  isInMove: Accessor<boolean>;
}

export function VoirieItem(props: VoirieItem) {
  const [style, setstyle] = createSignal<string>("");
  const [classe, setclasse] = createSignal<string>("");

  createEffect(() => {
    const val = props.weight.start / 5 + 2; // explication du calcul (h/60)*12+2 => (h/60)*pas+init => simplification
    const displayBlock = (props.weight.end - props.weight.start) / 5;
    setstyle("grid-row: " + val + " / span " + Math.min(displayBlock, 287));
    props.isInMove
      ? setclasse("relative mt-px flex " + (props.isInMove() ?? "disabled"))
      : console.log("Impossible to modify item size");
  });

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
        <VoirieItemRangeElem
          weight={props.weight}
          setNewWeigth={props.setNewWeigth}
        />
        <ButtonIcon
          icon={<CheckIcon />}
          onClick={() => AddOrUpdate(props.way_id, props.weight)}
          class="text-blue-700 text-sm ml-2 mt-0 h-5"
        />
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => Delete(props.way_id, props.weight)}
          class="text-blue-700 text-sm ml-2 mt-0 h-5"
        />
      </a>
    </li>
  );
}

function AddOrUpdate(way_id: number, weight: weight): void {
  OsrmService.setWeight(way_id, weight.weight, weight.start, weight.end);
  setSelectedWay((step) => {
    if (step) {
      return {
        ...step,
        flaxib_weight: step.flaxib_weight.map((elem) => {
          if (elem.end == weight.end && weight.start == elem.start) {
            return { ...elem, weight: weight.weight };
          }
          return elem;
        }),
      };
    }
  });
  const newval = getSelectedWay();
  if (newval) {
    setWays((ways) => {
      return [...ways.filter((step) => step.flaxib_way_id != way_id), newval];
    });
  }
}

function Delete(way_id: number, weight: weight): void {
  OsrmService.deleteWeight(way_id, weight.start, weight.end);

  setWays((ways) => {
    return ways.filter((step) => step.flaxib_way_id != way_id);
  });

  setSelectedWay();
}
