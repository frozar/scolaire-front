import { setSchoolPointsColor, setStopPointsColor } from "../leafletUtils";
import { deselectAllBusCourses } from "../views/content/map/component/organism/BusCourses";
import { deselectAllPoints } from "../views/content/map/component/organism/Points";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_FOCUS,
} from "../views/content/map/constant";

export namespace MapElementUtils {
  export function deselectAllPointsAndBusCourses() {
    deselectAllPoints();
    deselectAllBusCourses();
    setStopPointsColor([], COLOR_STOP_FOCUS);
    setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  }
}
