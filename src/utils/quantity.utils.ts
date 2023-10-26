import { AssociatedSchoolType } from "../_entities/_utils.entity";
import { GradeTripType } from "../_entities/grade.entity";
import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { TripPointType, TripType } from "../_entities/trip.entity";
import { NatureEnum } from "../type";
import { getLines } from "../views/content/map/component/organism/BusLines";
import {
  getSchools,
  setSchools,
} from "../views/content/map/component/organism/SchoolPoints";
import { setStops } from "../views/content/map/component/organism/StopPoints";

enum OperationType {
  set,
  substract,
  add,
}

export namespace QuantityUtils {
  // TODO: Empêcher la création de plusieurs student to school ayant le même gradeId sur un même stop depuis le board "stop-details"
  export function remainingStudentToGradeQuantity(
    point: AssociatedSchoolType,
    stopId: number
  ) {
    const gradeId = point.gradeId;
    const gradeTrips = getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter((tripPoint) => tripPoint.id == stopId)
      .flatMap((_tripPoint) => _tripPoint.grades)
      .filter((grade) => grade.gradeId == gradeId);
    if (gradeTrips.length == 0) return point.quantity;
    else {
      let usedQuantity = 0;
      gradeTrips.forEach((gradeTrip) => (usedQuantity += gradeTrip.quantity));
      return point.quantity - usedQuantity;
    }
  }

  export function totalGradeQuantity(gradeId: number) {
    let quantity = 0;

    getSchools().forEach((school) =>
      school.associated.forEach((assoc) => {
        if (assoc.gradeId == gradeId) quantity += assoc.quantity;
      })
    );

    return quantity;
  }

  export function remainingGradeQuantity(gradeId: number) {
    const totalQuantity = totalGradeQuantity(gradeId);
    let usedQuantity = 0;

    getLines()
      .flatMap((line) => line.trips.flatMap((trip) => trip.tripPoints))
      .flatMap((tripPoint) => tripPoint.grades)
      .forEach((gradeTrip) => {
        if (gradeTrip.gradeId == gradeId) usedQuantity += gradeTrip.quantity;
      });

    return totalQuantity - usedQuantity;
  }

  export function updateGradeTripQuantity(
    grades: GradeTripType[],
    point: StopType
  ): GradeTripType[] {
    // Get all corresponding gradeTrip
    const gradeTrips = getLines()
      .flatMap((line) => line.trips)
      .flatMap((trip) => trip.tripPoints)
      .filter((tripPoint) => tripPoint.id == point.id)
      .flatMap((_tripPoint) => _tripPoint.grades);

    // Substract used quantity
    grades.forEach((grade) => {
      gradeTrips.forEach((_gradeTrip) => {
        if (_gradeTrip.gradeId == grade.gradeId) {
          grade.quantity -= _gradeTrip.quantity;
        }
      });
    });
    return grades;
  }

  export function set(trips: TripType[]) {
    trips.forEach((trip) => {
      trip.schools.forEach((school) => {
        setSchoolQuantity(school, trip.tripPoints, OperationType.set);
      });

      trip.tripPoints.forEach((point) => {
        setStopQuantity(point, trip.schools, OperationType.set);
      });
    });
  }
  export function add(trip: TripType) {
    operation(trip, OperationType.add);
  }

  export function substract(trip: TripType) {
    operation(trip, OperationType.substract);
  }

  function operation(trip: TripType, operation: OperationType) {
    trip.schools.forEach((school) => {
      setSchoolQuantity(school, trip.tripPoints, operation);
    });

    trip.tripPoints.forEach((point) => {
      setStopQuantity(point, trip.schools, operation);
    });
  }

  //TODO to check and fix
  function setSchoolQuantity(
    school: SchoolType,
    points: TripPointType[],
    operation: OperationType
  ) {
    points.forEach((point) => {
      if (point.nature === NatureEnum.stop) {
        setSchools((schools) => {
          schools.map((_school) => {
            if (_school.id == school.id) {
              _school.associated.map((stop) => {
                if (stop.stopId == point.id) {
                  if (operation === OperationType.set)
                    stop.quantity = point.quantity;
                  else if (operation === OperationType.add)
                    stop.quantity += point.quantity;
                  else if (operation === OperationType.substract)
                    stop.quantity -= point.quantity;
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
    point: TripPointType,
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
