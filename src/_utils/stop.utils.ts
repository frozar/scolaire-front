import { AssociatedStopType } from "../_entities/_utils.entity";
import { GradeType } from "../_entities/grade.entity";
import { StopType } from "../_entities/stop.entity";
import { StopStore } from "../_stores/stop.store";
import { getTrips } from "../_stores/trip.store";
import { NatureEnum } from "../type";

export namespace StopUtils {
  export function stopsWithQuantityByGrades(
    grades: GradeType[],
    tripDirection: number
  ): StopType[] {
    const gradesID: number[] = grades.map((grade) => grade.id as number);

    /**
     * Get the associatedStops from the Grades (properties)
     */
    const associatedStops: AssociatedStopType[] = [];
    for (const grade of grades) {
      for (const associatedStop of grade.associatedStops) {
        associatedStops.push({ ...associatedStop });
      }
    }

    /**
     * get the quantity of student on the trips (corresponding to
     * the trip direction and the grades)
     */
    const associatedStopsFromTrips: {
      stopId: number;
      gradeId: number;
      quantity: number;
    }[] = [];

    for (const trip of getTrips()) {
      if (
        trip.tripDirectionId == tripDirection &&
        trip.grades.some((grade) => gradesID.includes(grade.id as number))
        //TODO ajouter le check des days applicable
      ) {
        for (const tripPoint of trip.tripPoints) {
          if (tripPoint.nature == NatureEnum.stop) {
            for (const tripPointGrade of tripPoint.grades) {
              if (gradesID.includes(tripPointGrade.gradeId)) {
                associatedStopsFromTrips.push({
                  stopId: tripPoint.id,
                  gradeId: tripPointGrade.gradeId,
                  quantity: tripPointGrade.quantity,
                });
              }
            }
          }
        }
      }
    }

    /**
     * Décompte des quantités utilisées
     */
    const associatedStopWithQt = associatedStops.map((associatedStop) => {
      for (const quantityUsed of associatedStopsFromTrips) {
        if (
          associatedStop.gradeId == quantityUsed.gradeId &&
          associatedStop.stopId == quantityUsed.stopId
        ) {
          associatedStop.quantity -= quantityUsed.quantity;
        }
      }
      return associatedStop;
    });

    const stops: StopType[] = associatedStopWithQt
      .filter((associated) => associated.quantity > 0)
      .map((associated) => StopStore.get(associated.stopId) as StopType);

    return stops;
  }
}
