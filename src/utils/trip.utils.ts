import { TripService } from "../_services/trip.service";
import { setTrips } from "../views/content/map/component/organism/Trips";
import { QuantityUtils } from "./quantity.utils";

export namespace TripUtils {
  export async function set() {
    const trips = await TripService.getAll();
    console.log("trips", trips);
    setTrips(trips);
    QuantityUtils.set(trips);
  }
}
