import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { GradeType } from "../../../../_entities/grade.entity";
import { StopType } from "../../../../_entities/stop.entity";
import { getStops } from "../../../../_stores/stop.store";
import {
  setStopPointColor,
  setStopPointOnClick,
} from "../../_component/molecule/StopPoint";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import BoardTitle from "../../board/component/atom/BoardTitle";
import BoardFooterActions from "../../board/component/molecule/BoardFooterActions";
import { COLOR_STOP_FOCUS, COLOR_STOP_LIGHT } from "../../map/constant";
import { CheckableElementList } from "../molecule/CheckableElementList";
import "./SelectStopsStep.css";

export function SelectStopsStep(props: {
  grades: GradeType[];
  stops: StopType[];
  previousStep: () => void;
  nextStep: () => void;
  onUpdate: (stops: StopType[]) => void;
}) {
  const [localStopsId, setLocalStopsId] = createSignal<number[]>([]);

  //eslint-disable-next-line
  const selectedGradesId = props.grades.map((grade) => grade.id);
  const possibleStops = [
    ...getStops().filter((stop) =>
      stop.associated.some((associatedschool) =>
        selectedGradesId.includes(associatedschool.gradeId)
      )
    ),
  ];

  onMount(() => {
    setStopsId(props.stops);
    setDisplayStops(possibleStops);
    setStopPointOnClick(() => onUpdateStop);
    setStopPointColor(() => mapStopPointColor);
  });

  createEffect(() => {
    setStopsId(props.stops);
  });

  onCleanup(() => {
    setDisplayStops([]);
    setStopPointOnClick();
    setStopPointColor();
  });

  function setStopsId(stops: StopType[]) {
    setLocalStopsId(stops.map((stop) => stop.id ?? -1));
  }

  function mapStopPointColor(stop: StopType): string {
    if (props.stops.map((stop) => stop.id).includes(stop.id)) {
      return COLOR_STOP_FOCUS;
    } else {
      return COLOR_STOP_LIGHT;
    }
  }

  function onUpdateStop(stop: StopType): void {
    const stops = [...props.stops];
    let index: number | undefined = undefined;
    for (const gradeIndex in stops) {
      if (stops[gradeIndex].id == stop.id) {
        index = Number(gradeIndex);
      }
    }
    if (index == undefined) {
      stops.push(stop);
    } else {
      stops.splice(index, 1);
    }
    props.onUpdate(stops);
  }

  return (
    <>
      <BoardTitle title="Sélection des classes" />
      <div class="select-grades">
        <For each={props.grades}>
          {(grade) => {
            return (
              <CheckableElementList
                title={grade.name}
                displayQuantity={false}
                elements={getStops()
                  .filter((stop) =>
                    stop.associated.some(
                      (associatedschool) => associatedschool.gradeId == grade.id
                    )
                  )
                  .map((stop) => {
                    return {
                      name: stop.name,
                      id: stop.id ?? -1,
                      checked: localStopsId().includes(stop.id ?? -1),
                      onChange: () => onUpdateStop(stop),
                      //TODO disabled si quantité = 0
                      //TODO afficher quantité
                    };
                  })}
              />
            );
          }}
        </For>
      </div>
      <BoardFooterActions
        nextStep={{
          callback: props.nextStep,
          label: "Suivant",
          disable: localStopsId().length == 0,
        }}
        previousStep={{
          callback: props.previousStep,
          label: "Précédent",
        }}
      />
    </>
  );
}
