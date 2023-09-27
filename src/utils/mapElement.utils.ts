import { setSchoolPointsColor, setStopPointsColor } from "../leafletUtils";
import { deselectAllBusLines } from "../views/content/map/component/organism/BusLines";
import { deselectAllPoints } from "../views/content/map/component/organism/Points";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_FOCUS,
} from "../views/content/map/constant";

export namespace MapElementUtils {
  export function deselectAllPointsAndBusLines() {
    deselectAllPoints();
    deselectAllBusLines();
    setStopPointsColor([], COLOR_STOP_FOCUS);
    setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  }
}
