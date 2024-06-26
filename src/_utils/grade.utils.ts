import { AssociatedStopType } from "../_entities/_utils.entity";
import { GradeTripType, GradeType } from "../_entities/grade.entity";
import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { TripPointType } from "../_entities/trip.entity";
import { StopStore } from "../_stores/stop.store";
import { setDisplayStops } from "../views/content/_component/organisme/StopPoints";

export namespace GradeUtils {
  export function displayStopsOfGrades(grades: GradeType[]) {
    setDisplayStops(getStopsOfGrades(grades));
  }

  export function getStopsOfGrades(grades: GradeType[]) {
    const stops: StopType[] = [];
    for (const grade of grades) {
      for (const associatedStop of grade.associatedStops) {
        if (!stops.some((stop) => stop.id == associatedStop.stopId)) {
          stops.push(StopStore.get(associatedStop.stopId) as StopType);
        }
      }
    }
    return stops;
  }

  export function gradesOfSchools(schools: SchoolType[]): GradeType[] {
    return schools.map((school) => school.grades).flat();
  }

  export function associatedStopGradeAvalaibleForStop(
    grades: GradeType[],
    stop: TripPointType
  ): AssociatedStopType[] {
    return grades
      .filter((grade) => {
        return grade.associatedStops.some(
          (associatedStop) => associatedStop.stopId == stop.id
        );
      })
      .map((grade) => grade.associatedStops)

      .flat()
      .filter((associated) => associated.stopId == stop.id);
  }

  export function getQuantityFromGradesTrip(gradesTrip: GradeTripType[]) {
    return gradesTrip
      .map((gradeTrip) => gradeTrip.quantity)
      .reduce((accumulator, quantity) => accumulator + quantity);
  }
}
