import { setSchoolPointsColor, setStopPointsColor } from "../leafletUtils";
import { deselectAllCourses } from "../views/content/map/component/organism/Courses";
import { deselectAllPoints } from "../views/content/map/component/organism/Points";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_STOP_FOCUS,
} from "../views/content/map/constant";

export namespace MapElementUtils {
  export function deselectAllPointsAndBusCourses() {
    deselectAllPoints();
    deselectAllCourses();
    setStopPointsColor([], COLOR_STOP_FOCUS);
    setSchoolPointsColor([], COLOR_SCHOOL_FOCUS);
  }
}
