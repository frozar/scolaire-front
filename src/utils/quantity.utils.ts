import { AssociatedPointType } from "../_entities/_utils.entity";
import { CoursePointType, CourseType } from "../_entities/course.entity";
import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { NatureEnum } from "../type";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import {
  getStops,
  setStops,
} from "../views/content/map/component/organism/StopPoints";

enum OperationType {
  set,
  substract,
  add,
}

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

  export function remainingQuantities(points: AssociatedPointType[]) {
    let quantity = 0;
    points.forEach((point) => {
      quantity += remaining(point);
    });
    console.log(quantity);
    return quantity;
  }

  export function remaining(point: AssociatedPointType) {
    return point.quantity - point.usedQuantity;
  }

  export function substract(point: StopType | SchoolType, course: CourseType) {
    operation(point, course, OperationType.substract);

    console.log("SUBSTRACT------------------");
    console.log("Schools", getSchools());
    console.log("Stops", getStops());
  }

  export function add(point: StopType | SchoolType, course: CourseType) {
    operation(point, course, OperationType.add);

    console.log("ADD------------------");
    console.log("Schools", getSchools());
    console.log("Stops", getStops());
  }

  function operation(
    point: StopType | SchoolType,
    course: CourseType,
    operation: OperationType
  ) {
    if (point.nature === NatureEnum.stop) {
      const stop = point;
      course.schools.forEach((school) =>
        shoolQuantityOperation(stop.id, school, course.points, operation)
      );

      course.points.forEach((point) =>
        stopQuantityOperation(stop.id, point, course.schools, operation)
      );
    }
  }
  function shoolQuantityOperation(
    stopId: number,
    school: SchoolType,
    points: CoursePointType[],
    operation: OperationType
  ) {
    // TODO non opérationnel
    points.forEach((point) => {
      if (point.nature === NatureEnum.stop && point.id == stopId) {
        setSchools((schools) => {
          schools.map((_school) => {
            if (_school.id == school.id) {
              _school.associated.map((stop) => {
                if (stop.id == point.id) {
                  if (operation === OperationType.set)
                    stop.usedQuantity = point.quantity;
                  else if (operation === OperationType.add)
                    stop.usedQuantity += point.quantity;
                  else if (operation === OperationType.substract)
                    stop.usedQuantity -= point.quantity;
                }
              });
            }
          });
          return schools;
        });
      }
    });
  }

  function stopQuantityOperation(
    stopId: number,
    point: CoursePointType,
    schools: SchoolType[],
    operation: OperationType
  ) {
    if (point.nature === NatureEnum.stop && point.id == stopId) {
      schools.forEach((school) => {
        setStops((stops) => {
          stops.map((stop) => {
            if (stop.id == point.id) {
              stop.associated.map((_school) => {
                if (_school.id == school.id) {
                  if (operation === OperationType.set)
                    _school.usedQuantity = point.quantity;
                  else if (operation === OperationType.add)
                    _school.usedQuantity += point.quantity;
                  else if (operation === OperationType.substract)
                    _school.usedQuantity -= point.quantity;
                }
              });
            }
          });
          return stops;
        });
      });
    }
  }

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
              stop.associated.map((_school) => {
                if (_school.id == school.id) {
                  _school.usedQuantity = point.quantity;
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
