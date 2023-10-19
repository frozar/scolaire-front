import { setSchoolPointsColor, setStopPointsColor } from "../leafletUtils";
import { deselectAllPoints } from "../views/content/map/component/organism/Points";
import { deselectAllTrips } from "../views/content/map/component/organism/Trips";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_FOCUS,
} from "../views/content/map/constant";

export namespace MapElementUtils {
  export function deselectAllPointsAndBusTrips() {
    deselectAllPoints();
    deselectAllTrips();
    setStopPointsColor([], COLOR_STOP_FOCUS);
    setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  }
}
