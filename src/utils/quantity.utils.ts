import { CoursePointType, CourseType } from "../_entities/course.entity";
import { SchoolType } from "../_entities/school.entity";
import { ClassToSchoolTypeFormatedWithUsedQuantity } from "../_entities/student-to-school.entity";
import { NatureEnum } from "../type";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";
export namespace QuantityUtils {
  export function set(courses: CourseType[]) {
    courses.forEach((course) => {
      course.schools.forEach((school) => {
        setSchoolQuantity(school, course.points);
      });

      course.points.forEach((point) => {
        setStopQuantity(point, course.schools);
      });
    });
  }

  export function remainingQuantities(
    points: ClassToSchoolTypeFormatedWithUsedQuantity[]
  ) {
    let quantity = 0;
    points.forEach((point) => {
      quantity += remaining(point);
    });
    console.log(quantity);
    return quantity;
  }

  export function remaining(point: ClassToSchoolTypeFormatedWithUsedQuantity) {
    return point.quantity - point.usedQuantity;
  }

  // export function substract(course: CourseType) {
  //   // Foreach substract quantity on Stops with School_id
  //   // Foreach substract quantity on Schools with Stop_id
  // }
  // export function add(course: CourseType) {
  //   // Foreach add quantity on Stops with School_id
  //   // Foreach add quantity on Schools with Stop_id
  // }

  function setSchoolQuantity(school: SchoolType, points: CoursePointType[]) {
    points.forEach((point) => {
      if (point.nature === NatureEnum.stop) {
        setSchools((schools) => {
          schools.map((_school) => {
            if (_school.id == school.id) {
              _school.associated.map((stop) => {
                if (stop.id == point.id) {
                  stop.usedQuantity = point.quantity;
                }
              });
            }
          });
          return schools;
        });
      }
    });
  }

  function setStopQuantity(point: CoursePointType, schools: SchoolType[]) {
    if (point.nature === NatureEnum.stop) {
      schools.forEach((school) => {
        setStops((stops) => {
          stops.map((stop) => {
            if (stop.id == point.id) {
              stop.associated.map((associatedClassToSchool) => {
                if (associatedClassToSchool.id == school.id) {
                  associatedClassToSchool.usedQuantity = point.quantity;
                }
              });
            }
          });
          return stops;
        });
      });
    }
  }
}
