import { range } from "lodash";

import { GradeEntity } from "../_entities/grade.entity";
import { LineType } from "../_entities/line.entity";
import {
  TripDirectionEntity,
  TripDirectionEnum,
} from "../_entities/trip-direction.entity";
import { TripPointType, TripType } from "../_entities/trip.entity";
import { TripService } from "../_services/trip.service";
import { addNewUserInformation } from "../signaux";
import { MessageLevelEnum, MessageTypeEnum, NatureEnum } from "../type";
import {
  DrawTripStep,
  currentDrawTrip,
  displayTripModeEnum,
  setCurrentStep,
  setDisplayTripMode,
} from "../views/content/board/component/organism/DrawTripBoard";
import { changeBoard } from "../views/content/board/component/template/ContextManager";
import {
  getLines,
  getSelectedLine,
  setLines,
} from "../views/content/map/component/organism/BusLines";
import { setselectedTrip } from "../views/content/map/component/organism/Trips";
import { quitModeDrawTrip } from "../views/content/map/shortcut";

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

  export function getTimePassage(
    indice: number,
    trip: TripType,
    tripPoint: TripPointType
  ): string {
    const firstHour: string = trip.startTime
      ? GradeEntity.getStringFromHourFormat(trip.startTime)
      : "00:00";
    if (indice == 0 || !tripPoint.passageTime) return firstHour;

    let seconds = 0;
    for (const i in range(indice + 1)) {
      seconds += trip.tripPoints[i].passageTime ?? 0;
    }
    const hourMinute = TripUtils.convertSecondesToHourMinute(seconds);
    return TripUtils.addHourTogether(firstHour, hourMinute);
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
        level: MessageLevelEnum.error,
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
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Votre course aller doit commencer par un arrêt.",
      });
    return tripDirection == TripDirectionEnum.going && !canRemove;
  }

  export async function createOrUpdateTrip() {
    // eslint-disable-next-line solid/reactivity
    let updatedTrip: TripType = currentDrawTrip() as TripType;
    if (currentDrawTrip()?.id == undefined) {
      updatedTrip = await TripService.create(currentDrawTrip() as TripType);
      const selectedLineId = getSelectedLine()?.id as number;

      setLines((lines) =>
        lines.map((line) =>
          line.id != selectedLineId
            ? line
            : { ...line, trips: [...line.trips, updatedTrip] }
        )
      );
    } else {
      updatedTrip = await TripService.update(currentDrawTrip() as TripType);

      setLines((prev) =>
        prev.map((line) => {
          return {
            ...line,
            trips: line.trips.map((trip) =>
              trip.id == updatedTrip.id ? updatedTrip : trip
            ),
          };
        })
      );
    }
    setselectedTrip(updatedTrip);

    setDisplayTripMode((prev) =>
      prev == displayTripModeEnum.straight ? prev : displayTripModeEnum.straight
    );

    setCurrentStep(DrawTripStep.initial);
    quitModeDrawTrip();

    changeBoard("line-details");
  }

  export function isValidTrip(trip: TripType): boolean {
    const tripDirection = TripDirectionEntity.FindDirectionById(
      trip.tripDirectionId
    );

    if ((currentDrawTrip()?.tripPoints.length ?? 0) < 2) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Votre course doit contenir à minima 2 points",
      });
      return false;
    }

    switch (tripDirection.type) {
      case TripDirectionEnum.going:
        if (
          trip.tripPoints[trip.tripPoints.length - 1].nature !=
          NatureEnum.school
        ) {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content: "Votre course aller doit se terminer par une école.",
          });
          return false;
        } else if (trip.tripPoints[0].nature != NatureEnum.stop) {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content: "Votre course aller doit commencer par un arrêt.",
          });
          return false;
        }
        break;
      case TripDirectionEnum.coming:
        if (
          trip.tripPoints[trip.tripPoints.length - 1].nature != NatureEnum.stop
        ) {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content: "Votre course retour doit se terminer par un arrêt.",
          });
          return false;
        } else if (trip.tripPoints[0].nature != NatureEnum.school) {
          addNewUserInformation({
            displayed: true,
            level: MessageLevelEnum.error,
            type: MessageTypeEnum.global,
            content: "Votre course retour doit commencer par une école.",
          });
          return false;
        }
        break;
    }
    return true;
  }
}
