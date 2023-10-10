import { RaceService } from "../_services/race.service";
import { setRaces } from "../views/content/map/component/organism/Races";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { QuantityUtils } from "./quantity.utils";

export namespace RaceUtils {
  export async function set() {
    const races = await RaceService.getAll();
    setRaces(races);
    QuantityUtils.set(races);

    console.log("Schools", getSchools());
    console.log("Stops", getStops());
  }
}
