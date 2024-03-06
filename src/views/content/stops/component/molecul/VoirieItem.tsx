import {
  Accessor,
  Setter,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import { OsrmService, weight } from "../../../../../_services/osrm.service";
import CheckIcon from "../../../../../icons/CheckIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { addNewGlobalSuccessInformation } from "../../../../../signaux";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { getWaysById, setWays } from "../../../map/Map";
import {
  getSelectedWays,
  setSelectedWays,
} from "../../../map/component/molecule/LineWeight";
import { VoirieItemRangeElem } from "../atom/VoirieItemRangeElem";
import { minuteToTime } from "../organism/VoirieDay";
import { resetNewWeight } from "../organism/VoirieItems";
interface VoirieItem {
  weight: weight;
  way_id: number;
  setNewWeigth: Setter<weight>;
  isInMove: Accessor<boolean>;
  isOnDrawMode: boolean;
}

export function VoirieItem(props: VoirieItem) {
  const [style, setstyle] = createSignal<string>("");
  const [classe, setclasse] = createSignal<string>("");
  const [prevWeight, setprevWeight] = createSignal<number>();

  onMount(() =>
    props.isOnDrawMode ? setprevWeight(-1) : setprevWeight(props.weight.weight)
  );

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
        if (prevWeight() == undefined) {
          setprevWeight(props.weight.weight);
        }
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
          onClick={() => AddOrUpdate(props.weight, setprevWeight)}
          class="text-blue-700 text-sm ml-2 mt-0 h-5"
          disable={prevWeight() == props.weight.weight}
        />
        <ButtonIcon
          icon={<TrashIcon />}
          onClick={() => Delete(props.weight, props.isOnDrawMode)}
          class="text-blue-700 text-sm ml-2 mt-0 h-5"
        />
      </a>
    </li>
  );
}
function AddOrUpdate(
  weight: weight,
  setprevWeight: Setter<number | undefined>
): void {
  OsrmService.setWeights(weight.weight, weight.start, weight.end);

  setWays((ways) => {
    return ways.map((way) => {
      if (
        getSelectedWays()
          .map((Selectedway) => Selectedway.flaxib_way_id)
          .includes(way.flaxib_way_id)
      ) {
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
  setSelectedWays(
    getWaysById(getSelectedWays().map((selected) => selected.flaxib_way_id))
  );
  addNewGlobalSuccessInformation("La pondération a été modifiée");

  resetNewWeight();
  setprevWeight(weight.weight);
}

function Delete(weight: weight, isOnDrawMode: boolean): void {
  if (!isOnDrawMode) {
    const selectedIds = getSelectedWays().map((way) => way.flaxib_way_id);
    OsrmService.deleteWeights(selectedIds, weight.start, weight.end);

    setWays((ways) => {
      return ways.map((way) => {
        if (selectedIds.includes(way.flaxib_way_id)) {
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

    setSelectedWays(
      getWaysById(getSelectedWays().map((selected) => selected.flaxib_way_id))
    );
    addNewGlobalSuccessInformation("La pondération a été supprimée");
  } else {
    resetNewWeight();
  }
}
