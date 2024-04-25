import { createSignal } from "solid-js";

export enum TripDirectionEnum {
  none,
  roundTrip = "roundTrip",
  going = "going",
  coming = "coming",
}

export const [tripDirections, setTripDirections] = createSignal<
  TripDirectionType[]
>([
  {
    id: 1,
    type: TripDirectionEnum.roundTrip,
  },
  {
    id: 2,
    type: TripDirectionEnum.going,
  },
  {
    id: 3,
    type: TripDirectionEnum.coming,
  },
]);

export type TripDirectionType = {
  id: number;
  type: TripDirectionEnum;
};

export namespace TripDirectionEntity {
  export function FindDirectionById(
    tripId: number | undefined
  ): TripDirectionType {
    const index = tripDirections()?.findIndex(
      (item) => item.id == (!tripId ? 1 : tripId)
    );
    return tripDirections()[index];
  }

  export function findDirectionByDirectionName(
    direction: TripDirectionEnum
  ): TripDirectionType {
    const index = tripDirections().findIndex((item) => item.type == direction);
    return tripDirections()[index];
  }

  export function isGoing(directionId: number) {
    return (
      TripDirectionEntity.findEnumById(directionId) == TripDirectionEnum.going
    );
  }

  export function findIdByEnum(tripDirection: TripDirectionEnum) {
    let output = 0;
    for (const direction of tripDirections()) {
      if (direction.type == tripDirection) {
        output = direction.id;
      }
    }
    return output;
  }

  export function findEnumById(id: number) {
    let output = TripDirectionEnum.none;
    for (const direction of tripDirections()) {
      if (direction.id == id) {
        output = direction.type;
      }
    }
    return output;
  }
}
