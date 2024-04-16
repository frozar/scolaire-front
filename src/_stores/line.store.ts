import { createSignal } from "solid-js";
import { LineType } from "../_entities/line.entity";
import { TripType } from "../_entities/trip.entity";
import { TripStore } from "./trip.store";

export const [getLines, setLines] = createSignal<LineType[]>([]);

//TODO faire le namespace set, update, delete

export namespace LineStore {
  export function set(lines: LineType[] | ((prev: LineType[]) => LineType[])) {
    setLines(lines);
    setTrips();
  }

  export function add(line: LineType) {
    set((prev) => {
      prev.push(line);
      return [...prev];
    });
  }

  export function remove(lineId: number) {
    set(getLines().filter((line) => line.id != lineId));
  }

  export function getFromTrip(trip: TripType) {
    return getLines().find((line) => {
      return line.trips.some((_trip) => _trip.id == trip.id);
    });
  }
}

function setTrips() {
  TripStore.set(
    getLines()
      .map((line) => line.trips)
      .flat()
  );
}
