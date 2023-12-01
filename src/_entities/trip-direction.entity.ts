import { createSignal } from "solid-js";

export const [tripDirections, setTripDirections] = createSignal<
  TripDirectionType[]
>([]);

export enum TripDirectionEnum {
  none,
  roundTrip = "roundTrip",
  going = "going",
  coming = "coming",
}

export type TripDirectionType = {
  id: number;
  type: TripDirectionEnum;
};

export namespace TripDirectionEntity {
  export function findTripById(tripId: number): TripDirectionType {
    const index = tripDirections()?.findIndex((item) => item.id == tripId);
    return tripDirections()[index];
  }

  export function findTripByDirection(
    direction: TripDirectionEnum
  ): TripDirectionType {
    const index = tripDirections().findIndex((item) => item.type == direction);
    return tripDirections()[index];
  }
}
