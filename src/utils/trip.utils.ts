import { LineType } from "../_entities/line.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { TripPointType, TripType } from "../_entities/trip.entity";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum, NatureEnum } from "../type";
import { currentDrawTrip } from "../views/content/board/component/organism/DrawTripBoard";
import { getLines } from "../views/content/map/component/organism/BusLines";

export namespace TripUtils {
  export function get(tripId: number) {
    return getLines()
      .flatMap((line) => line.trips)
      .filter((trip) => trip.id == tripId)[0];
  }

  export function getAll(): TripType[] {
    return getLines().flatMap((line) => line.trips);
  }

  export function getLine(tripId: number): LineType {
    return getLines().filter((line) =>
      line.trips.some((trip) => trip.id == tripId)
    )[0];
  }

  export function convertSecondesToHourMinute(secondes: number): string {
    const hour: number = Math.floor(secondes / 3600);
    const minutes: number = Math.floor((secondes % 3600) / 60);

    const hourStr: string = hour < 10 ? "0" + hour : hour.toString();
    const minutesStr: string =
      minutes < 10 ? "0" + minutes : minutes.toString();

    return `${hourStr}:${minutesStr}`;
  }

  export function addHourTogether(heure1: string, heure2: string): string {
    const [hour1, minutes1] = heure1.split(":").map(Number);
    const [hour2, minutes2] = heure2.split(":").map(Number);

    let totalHour = hour1 + hour2;
    let totalMinutes = minutes1 + minutes2;

    // Gérer le cas où les minutes dépassent 60
    totalHour += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    // Formater les heures et les minutes en chaînes de caractères avec des zéros ajoutés si nécessaire
    const hourStr: string =
      totalHour < 10 ? "0" + totalHour : totalHour.toString();
    const minutesStr: string =
      totalMinutes < 10 ? "0" + totalMinutes : totalMinutes.toString();

    return `${hourStr}:${minutesStr}`;
  }

  export function tripDirectionTypeTofrench(direction: TripDirectionEnum) {
    switch (direction) {
      case TripDirectionEnum.coming:
        return "Retour";
      case TripDirectionEnum.going:
        return "Aller";
      case TripDirectionEnum.roundTrip:
        return "Aller/Retour";
    }
  }

  function getIndexOfFirstSchool(tripPoints: TripPointType[]) {
    return tripPoints.findIndex((item) => item.nature == NatureEnum.school);
  }

  export function getSplitedTripPointsAtFirstSchoolPosition(
    tripPoints: TripPointType[]
  ) {
    return [...tripPoints].slice(
      getIndexOfFirstSchool(tripPoints),
      tripPoints.length
    );
  }

  export function canRemoveSchoolPointFromTrip(
    pointLeafletId: number
  ): boolean {
    const tripDirection = TripDirectionEntity.FindDirectionById(
      currentDrawTrip().tripDirectionId
    ).type;
    const schoolIndex = currentDrawTrip().tripPoints.findIndex(
      (item) => item.leafletId == pointLeafletId
    );
    const nextItem = currentDrawTrip().tripPoints[schoolIndex + 1];
    const nextIsStop = nextItem ? nextItem.nature == NatureEnum.stop : false;
    const beforeItem = currentDrawTrip().tripPoints[schoolIndex - 1];
    const beforeIsSchool = beforeItem
      ? beforeItem.nature == NatureEnum.school
      : false;

    let canRemove = true;
    if (!beforeIsSchool && nextIsStop) canRemove = false;
    if (tripDirection == TripDirectionEnum.coming && !canRemove) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        content: "Votre course retour doit commencer par une école.",
      });
    }
    return tripDirection == TripDirectionEnum.coming && !canRemove;
  }

  export function canRemoveStopFromTrip(pointLeafletId: number): boolean {
    const tripDirection = TripDirectionEntity.FindDirectionById(
      currentDrawTrip().tripDirectionId
    ).type;
    const stopIndex = currentDrawTrip().tripPoints.findIndex(
      (item) => item.leafletId == pointLeafletId
    );
    const nextItem = currentDrawTrip().tripPoints[stopIndex + 1];
    const nextIsSchool = nextItem
      ? nextItem.nature == NatureEnum.school
      : false;
    const beforeItem = currentDrawTrip().tripPoints[stopIndex - 1];
    const beforeIsStop = beforeItem
      ? beforeItem.nature == NatureEnum.stop
      : false;

    let canRemove = true;
    if (!beforeIsStop && nextIsSchool) canRemove = false;
    if (tripDirection == TripDirectionEnum.going && !canRemove)
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.info,
        type: MessageTypeEnum.global,
        content: "Votre course aller doit commencer par un arrêt.",
      });
    return tripDirection == TripDirectionEnum.going && !canRemove;
  }
}
