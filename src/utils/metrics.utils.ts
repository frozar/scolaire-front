import { TripMetricType, TripPointType } from "../_entities/trip.entity";
import { osrmResponseType } from "../_services/osrm.service";
import { NatureEnum } from "../type";
import { GradeUtils } from "./grade.utils";

export namespace MetricsUtils {
  export function getAll(
    response: osrmResponseType,
    response_direct: osrmResponseType,
    points: TripPointType[]
  ): TripMetricType {
    const distance = response.routes[0].distance;

    const duration = response.routes[0].duration;

    const distanceDirect = response_direct.routes[0].distance;

    const deviation = distance / distanceDirect - 1;

    const kmPassager = getKmPassagers(response, points);

    const txRemplissMoy = kmPassager / (distance / 1000);
    return { distance, duration, deviation, kmPassager, txRemplissMoy };
  }

  // TODO: Verify in app it works properly with multiple schools in a trip
  function getKmPassagers(
    response: osrmResponseType,
    tripPoints: TripPointType[]
  ) {
    let kmPassager = 0;

    const schoolIds = tripPoints
      .filter((tripPoint) => tripPoint.nature == NatureEnum.school)
      .map((tripPoint) => tripPoint.id);
    let destinationSchoolIds = schoolIds;

    // Compute distances per school destination
    const remainingDistances: { [schoolId: number]: number } = {};
    response.routes[0].legs.map((elem, k) => {
      destinationSchoolIds.forEach((destination) =>
        k == 0
          ? (remainingDistances[destination] = elem.distance)
          : (remainingDistances[destination] += elem.distance)
      );
      // If school destination reached, removed from destinationSchoolIds
      if (tripPoints.at(k + 1)?.nature == NatureEnum.school) {
        destinationSchoolIds = destinationSchoolIds.filter(
          (destination) => destination != tripPoints.at(k + 1)?.id
        );
      }
    });

    response.routes[0].legs.map((elem, k) => {
      const grades = tripPoints.at(k)?.grades;

      // Update kmPassager
      grades?.forEach((grade) => {
        kmPassager +=
          grade.quantity *
          remainingDistances[GradeUtils.getSchoolId(grade.gradeId)];
      });

      // Update remaining distances
      for (const key of Object.keys(remainingDistances)) {
        remainingDistances[Number(key)] -= elem.distance;
      }
    });

    return kmPassager / 1000;
  }
}
