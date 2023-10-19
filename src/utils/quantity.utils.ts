import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { SchoolType } from "../_entities/school.entity";
import { RacePointType, RaceType } from "../_entities/trip.entity";
import { NatureEnum } from "../type";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";

enum OperationType {
  set,
  substract,
  add,
}

export namespace QuantityUtils {
  export function remaining(point: AssociatedSchoolType) {
    return point.quantity - point.usedQuantity;
  }

  export function remainingQuantities(points: AssociatedSchoolType[]) {
    let quantity = 0;
    points.forEach((point) => {
      quantity += remaining(point);
    });
    console.log(quantity);
    return quantity;
  }

  export function set(courses: RaceType[]) {
    courses.forEach((trip) => {
      trip.schools.forEach((school) => {
        setSchoolQuantity(school, trip.points, OperationType.set);
      });

      trip.points.forEach((point) => {
        setStopQuantity(point, trip.schools, OperationType.set);
      });
    });
  }
  export function add(trip: RaceType) {
    operation(trip, OperationType.add);
  }

  export function substract(trip: RaceType) {
    operation(trip, OperationType.substract);
  }

  function operation(trip: RaceType, operation: OperationType) {
    trip.schools.forEach((school) => {
      setSchoolQuantity(school, trip.points, operation);
    });

    trip.points.forEach((point) => {
      setStopQuantity(point, trip.schools, operation);
    });
  }

  function setSchoolQuantity(
    school: SchoolType,
    points: RacePointType[],
    operation: OperationType
  ) {
    points.forEach((point) => {
      if (point.nature === NatureEnum.stop) {
        setSchools((schools) => {
          schools.map((_school) => {
            if (_school.id == school.id) {
              _school.associated.map((stop) => {
                if (stop.schoolId == point.id) {
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

  function setStopQuantity(
    point: RacePointType,
    schools: SchoolType[],
    operation: OperationType
  ) {
    if (point.nature === NatureEnum.stop) {
      schools.forEach((school) => {
        setStops((stops) => {
          stops.map((stop) => {
            if (stop.id == point.id) {
              stop.associated.map((_school) => {
                if (_school.schoolId == school.id) {
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
}
