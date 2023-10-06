import { BusCourseService } from "../_services/course.service";
import { setCourses } from "../views/content/map/component/organism/Courses";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { QuantityUtils } from "./quantity.utils";

export namespace CourseUtils {
  export async function set() {
    const lines = await BusCourseService.getAll();
    setCourses(lines);
    QuantityUtils.set(lines);
    console.log("Schools", getSchools());
    console.log("Stops", getStops());
  }
}
