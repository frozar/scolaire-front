import { Accessor, Setter, createEffect, createSignal } from "solid-js";
import { OsrmService, weight } from "../../../../../_services/osrm.service";
import CheckIcon from "../../../../../icons/CheckIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getWayById, setWays } from "../../../map/Map";
import { setSelectedWay } from "../../../map/component/molecule/LineWeight";
import { VoirieItemRangeElem } from "../atom/VoirieItemRangeElem";
import { minuteToTime } from "../organism/VoirieDay";
import { resetNewWeight } from "../organism/VoirieItems";
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
  setWays((ways) => {
    return ways.map((way) => {
      if (way.flaxib_way_id == way_id) {
        return {
          ...way,
          flaxib_weight: [
            ...way.flaxib_weight.filter(
              (currentWeight) =>
                currentWeight.end != weight.end ||
                currentWeight.start != weight.start
            ),
            weight,
          ],
        };
      }
      return way;
    });
  });
  setSelectedWay(getWayById(way_id));
  resetNewWeight();
}

function Delete(way_id: number, weight: weight): void {
  OsrmService.deleteWeight(way_id, weight.start, weight.end);

  setWays((ways) => {
    return ways.map((way) => {
      if (way.flaxib_way_id == way_id) {
        return {
          ...way,
          flaxib_weight: way.flaxib_weight.filter(
            (currentWeight) =>
              currentWeight.end != weight.end ||
              currentWeight.start != weight.start
          ),
        };
      }
      return way;
    });
  });

  setSelectedWay(getWayById(way_id));
}