import { RaceService } from "../_services/trip.service";
import { setRaces } from "../views/content/map/component/organism/Trips";
import { QuantityUtils } from "./quantity.utils";

export namespace RaceUtils {
  export async function set() {
    const trips = await RaceService.getAll();
    console.log("trips", trips);
    setRaces(trips);
    QuantityUtils.set(trips);
  }
}
