import { createSignal } from "solid-js";
import { StopType } from "../_entities/stop.entity";
import { StopService } from "../_services/stop.service";

export const [getStops, setStops] = createSignal<StopType[]>([]);

export namespace StopStore {
  export function set(stops: StopType[]) {
    setStops(stops);
  }

  export function remove(stopId: number) {
    setStops(getStops().filter((stop) => stop.id != stopId));
  }

  export async function update(stop: StopType) {
    const updatedStop = await StopService.update(stop);
    if (updatedStop) {
      setStops((stops) =>
        [...stops].map((stop_) => {
          if (stop_.id == updatedStop.id) stop_ = updatedStop;
          return stop_;
        })
      );
    }
    return updatedStop;
  }
}
