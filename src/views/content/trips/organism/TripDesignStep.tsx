import { Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { TripDirectionEntity } from "../../../../_entities/trip-direction.entity";
import { TripType } from "../../../../_entities/trip.entity";
import BoardTitle from "../../board/component/atom/BoardTitle";
import SchoolsEnumeration from "../../board/component/molecule/SchoolsEnumeration";
import { DrawHelperButton } from "../atom/DrawHelperButton";

import { GradeUtils } from "../../../../_utils/grade.utils";
import { LabeledColorPicker } from "../../../../component/molecule/LabeledColorPicker";
import { setDisplaySchools } from "../../_component/organisme/SchoolPoints";
import { setDisplayStops } from "../../_component/organisme/StopPoints";
import BoardFooterActions from "../../board/component/molecule/BoardFooterActions";
import LabeledInputField from "../../board/component/molecule/LabeledInputField";
import Metrics from "../../board/component/organism/Metrics";
import CollapsibleElement from "../../line/atom/CollapsibleElement";
import { DisplayTripDaysAndDirection } from "../molecule/DisplayTripDaysAndDirection";
import { TripLineDisplaySwitcher } from "../molecule/TripLineDisplaySwitcher";
import { VehicleSelect } from "../molecule/VehicleSelect";
import "./TripDesignStep.css";
import { TripTimeline } from "./TripTimeline";

export function TripDesignStep(props: {
  trip: TripType;
  onUpdate: (trip: TripType) => void;
  nextStep: () => void;
  previousStep: () => void;
}) {
  // eslint-disable-next-line solid/reactivity
  const [localTrip, setLocalTrip] = createSignal<TripType>(props.trip);

  onMount(() => {
    setLocalTrip(props.trip);
    setDisplayOnMap(props.trip);
  });

  createEffect(() => {
    setDisplayOnMap(props.trip);
  });
  createEffect(() => {
    console.log(localTrip());
  });

  onCleanup(() => {
    setDisplaySchools([]);
    setDisplayStops([]);
  });

  function onUpdateName(name: string) {
    setLocalTrip((trip) => {
      trip.name = name;
      return trip;
    });
    props.onUpdate(localTrip());
  }

  function onUpdateVehicule(id: number) {
    setLocalTrip((trip) => {
      trip.busCategoriesId = id;
      return trip;
    });
    props.onUpdate(localTrip());
  }

  function onUpdateColor(color: string) {
    setLocalTrip((trip) => {
      return { ...trip, color: color };
    });
    props.onUpdate(localTrip());
  }

  return (
    <>
      <div class="trip-edit-design-step">
        <BoardTitle title="Dessinez votre course" />
        <Show
          when={
            (localTrip().tripPoints.length ?? 0) > 0 &&
            TripDirectionEntity.isGoing(localTrip().tripDirectionId)
          }
        >
          <DrawHelperButton schools={localTrip().schools} />
        </Show>
        <SchoolsEnumeration
          schoolsName={localTrip().schools.map((school) => school.name) ?? []}
        />
        <DisplayTripDaysAndDirection trip={localTrip()} />

        <CollapsibleElement title="Métriques">
          <Metrics trip={localTrip()} />
        </CollapsibleElement>

        <LabeledInputField
          label="Nom de la course"
          value={localTrip().name ?? ""}
          onInput={(e) => onUpdateName(e.target.value)}
          name="trip-name"
          placeholder="Nom de la course"
        />
        <VehicleSelect
          allotment_id={Number(localTrip().allotmentId)}
          tripPoints={localTrip().tripPoints}
          busCategoryId={localTrip().busCategoriesId ?? 0}
          onUpdateVehicule={onUpdateVehicule}
        />
        <section class="flex mt-4 justify-between">
          <LabeledColorPicker
            text="Couleur de la course"
            defaultColor={localTrip().color}
            onChange={onUpdateColor}
          />

          <TripLineDisplaySwitcher />
        </section>

        <Show
          when={(localTrip().tripPoints.length ?? 0) > 0}
          fallback={
            <div class="flex w-4/5 text-xs justify-center">
              Veuillez sélectionner des points sur la carte
            </div>
          }
        >
          <TripTimeline
            tripPoints={localTrip().tripPoints}
            trip={localTrip()}
            setTrip={setLocalTrip}
            inDraw={true}
          />
        </Show>
      </div>

      <BoardFooterActions
        nextStep={{
          callback: props.nextStep,
          label: "Enregistrer",
          //TODO ajouter un validateur [nom, tripPoints.lenght, ...??]
          //   disable: props.schools.length == 0,
        }}
        previousStep={{
          callback: props.previousStep,
          label: "Précédent",
        }}
      />
    </>
  );
}

function setDisplayOnMap(trip: TripType) {
  setDisplaySchools(trip.schools);
  GradeUtils.displayStopsOfGrades(trip.grades);
}
