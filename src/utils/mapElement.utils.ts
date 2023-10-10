import { setSchoolPointsColor, setStopPointsColor } from "../leafletUtils";
import { deselectAllPoints } from "../views/content/map/component/organism/Points";
import { deselectAllRaces } from "../views/content/map/component/organism/Races";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_FOCUS,
} from "../views/content/map/constant";

export namespace MapElementUtils {
  export function deselectAllPointsAndBusCourses() {
    deselectAllPoints();
    deselectAllRaces();
    setStopPointsColor([], COLOR_STOP_FOCUS);
    setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  }
}
