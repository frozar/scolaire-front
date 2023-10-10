import { AssociatedPointType } from "../_entities/_utils.entity";
import { RacePointType, RaceType } from "../_entities/race.entity";
import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { NatureEnum } from "../type";
import { setSchools } from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";

enum OperationType {
  set,
  substract,
  add,
}

export namespace QuantityUtils {
  export function remaining(point: AssociatedPointType) {
    return point.quantity - point.usedQuantity;
  }

  export function remainingQuantities(points: AssociatedPointType[]) {
    let quantity = 0;
    points.forEach((point) => {
      quantity += remaining(point);
    });
    console.log(quantity);
    return quantity;
  }

  export function set(courses: RaceType[]) {
    courses.forEach((race) => {
      race.schools.forEach((school) => {
        setSchoolQuantity(school, race.points);
      });

      race.points.forEach((point) => {
        setStopQuantity(point, race.schools);
      });
    });
  }
  export function add(point: StopType | SchoolType, race: RaceType) {
    operation(point, race, OperationType.add);
  }

  export function substract(point: StopType | SchoolType, race: RaceType) {
    operation(point, race, OperationType.substract);
  }

  function operation(
    point: StopType | SchoolType,
    race: RaceType,
    operation: OperationType
  ) {
    if (point.nature === NatureEnum.stop) {
      const stop = point;
      race.schools.forEach(
        (school) => school
        // shoolQuantityOperation(stop.id, school, race.points, operation)
      );

      race.points.forEach(
        (point) => point
        // stopQuantityOperation(stop.id, point, race.schools, operation)
      );
    }
  }

  function setSchoolQuantity(school: SchoolType, points: RacePointType[]) {
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

  function setStopQuantity(point: RacePointType, schools: SchoolType[]) {
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
