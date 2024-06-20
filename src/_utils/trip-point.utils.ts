import { SchoolType } from "../_entities/school.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { TripPointType, TripType } from "../_entities/trip.entity";
import { SchoolStore } from "../_stores/school.store";
import { NatureEnum } from "../type";

export namespace TripPointUtils {
  /**
   * Calcul the passage time in fonction of the index of the tripPoints
   * @param tripPoints
   * @param index
   * @returns
   */
  export function getCurrentPassageTime(
    tripPoints: TripPointType[],
    index: number
  ): number {
    let output = 0;
    for (const key in tripPoints) {
      // TODO Ajouter le Waiting time de Number(key)-1 si Number(key)!=0
      // TODO Aller chercher le WaitingTime selon les règles
      output += tripPoints[key].passageTime;
      if (Number(key) == index) {
        break;
      }
    }
    return output;
  }

  /**
   * Calcul the accumulate quantity in fonction of the index of the tripPoints
   * @param tripPoints
   * @param index
   * @returns
   */
  export function getAccumulateQuantity(trip: TripType, index: number) {
    let output = 0;

    for (const key in trip.tripPoints) {
      const signedQuantity: string = getSignedPointQuantity(
        trip.tripPoints[key],
        trip
      );
      output += parseInt(signedQuantity);
      if (Number(key) == index) {
        break;
      }
    }

    return output;
  }

  /**
   * Retrieve the signed point quantity
   * @param point
   * @param trip
   * @returns
   */
  export function getSignedPointQuantity(
    point: TripPointType,
    trip: TripType
  ): string {
    return getQuantitySign(point, trip) + getPointQuantity(point, trip);
  }

  function getPointQuantity(point: TripPointType, trip: TripType) {
    if (point.nature == NatureEnum.school) {
      return getSchoolQuantity(point, trip);
    } else {
      return getStopQuantity(point);
    }
  }

  function getQuantitySign(point: TripPointType, trip: TripType) {
    if (
      (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
        TripDirectionEnum.going &&
        point.nature == NatureEnum.stop) ||
      (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
        TripDirectionEnum.coming &&
        point.nature == NatureEnum.school)
    ) {
      return "+";
    } else if (
      (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
        TripDirectionEnum.going &&
        point.nature == NatureEnum.school) ||
      (TripDirectionEntity.findEnumById(trip.tripDirectionId) ==
        TripDirectionEnum.coming &&
        point.nature == NatureEnum.stop)
    ) {
      return "-";
    }

    return "";
  }

  function getSchoolQuantity(point: TripPointType, trip: TripType) {
    let output = 0;

    const school = SchoolStore.get(point.id) as SchoolType;
    const schoolGradesId: number[] = school.grades.map(
      (grade) => grade.id as number
    );

    for (const tripPoint of trip.tripPoints) {
      for (const grade of tripPoint.grades) {
        if (schoolGradesId.includes(grade.gradeId)) {
          output += grade.quantity;
        }
      }
    }

    return output;
  }

  function getStopQuantity(point: TripPointType) {
    return point.grades
      .map((grade) => grade.quantity)
      .reduce((total, quantity) => total + quantity, 0);
  }
}
