import { AssociatedPointType } from "../_entities/_utils.entity";
import { RacePointType, RaceType } from "../_entities/race.entity";
import { SchoolType } from "../_entities/school.entity";
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
        setSchoolQuantity(school, race.points, OperationType.set);
      });

      race.points.forEach((point) => {
        setStopQuantity(point, race.schools, OperationType.set);
      });
    });
  }
  export function add(race: RaceType) {
    operation(race, OperationType.add);
  }

  export function substract(race: RaceType) {
    operation(race, OperationType.substract);
  }

  function operation(race: RaceType, operation: OperationType) {
    race.schools.forEach((school) => {
      setSchoolQuantity(school, race.points, operation);
    });

    race.points.forEach((point) => {
      setStopQuantity(point, race.schools, operation);
    });
  }

  // TODO quentin
  function setSchoolQuantity(
    // classe : ClassType
    school: SchoolType,
    points: RacePointType[],
    operation: OperationType
  ) {
    points.forEach((point) => {
      if (point.nature === NatureEnum.stop) {
        setSchools((schools) => {
          schools.map((_school) => {
            // school.classes.map((_classe) => {
            // if (_classe.id == classe.id) {
            //   _classe.associated.map((stop) => {
            //     if (stop.id == point.id) {
            //       if (operation === OperationType.set)
            //         stop.usedQuantity = point.quantity;
            //       else if (operation === OperationType.add)
            //         stop.usedQuantity += point.quantity;
            //       else if (operation === OperationType.substract)
            //         stop.usedQuantity -= point.quantity;
            //     }
            //   });
            // }
            //   return _classe;
            // });
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

  // TODO quentin
  function setStopQuantity(
    point: RacePointType,
    // classes : ClasseType[]
    schools: SchoolType[],
    operation: OperationType
  ) {
    if (point.nature === NatureEnum.stop) {
      // classes.forEach((classe) => {
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
}
