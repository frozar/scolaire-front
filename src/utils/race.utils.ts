import { RaceService } from "../_services/race.service";
import { setRaces } from "../views/content/map/component/organism/Races";
import { QuantityUtils } from "./quantity.utils";

export namespace RaceUtils {
  export async function set() {
    const races = await RaceService.getAll();
    console.log("races", races);
    setRaces(races);
    QuantityUtils.set(races);
  }
}
