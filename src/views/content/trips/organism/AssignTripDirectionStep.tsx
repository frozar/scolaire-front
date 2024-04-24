import { createEffect, createSignal, onMount } from "solid-js";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../../../../_entities/trip-direction.entity";
import { TripDirectionsButton } from "../molecule/TripDirectionsButton";

export function AssignTripDirectionStep(props: {
  directionId: number;
  onUpdateDirection: (direction: TripDirectionEnum) => void;
}) {
  const [onTripDirection, setOnTripDirection] = createSignal<TripDirectionEnum>(
    TripDirectionEnum.coming
  );

  onMount(() => {
    setOnTripDirection(TripDirectionEntity.findEnumById(props.directionId));
  });

  createEffect(() => {
    props.onUpdateDirection(onTripDirection());
  });

  return (
    <>
      <p class="font-bold mb-3">Direction de la course</p>
      <TripDirectionsButton
        onClickComing={() => setOnTripDirection(TripDirectionEnum.coming)}
        onClickGoing={() => setOnTripDirection(TripDirectionEnum.going)}
        onDirection={onTripDirection()}
      />
    </>
  );
}
