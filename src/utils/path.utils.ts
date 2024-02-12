import { PathPointType, PathType } from "../_entities/path.entity";
import { SchoolType } from "../_entities/school.entity";
import { StopType } from "../_entities/stop.entity";
import { TripDirectionEntity } from "../_entities/trip-direction.entity";
import { TripType } from "../_entities/trip.entity";
import { PathService } from "../_services/path.service";
import {
  addNewUserInformation,
  disableSpinningWheel,
  enableSpinningWheel,
} from "../signaux";
import { MessageLevelEnum, MessageTypeEnum, NatureEnum } from "../type";
import {
  getLines,
  getSelectedLine,
  setLines,
} from "../views/content/map/component/organism/BusLines";
import { getSchools } from "../views/content/map/component/organism/SchoolPoints";
import { getStops } from "../views/content/map/component/organism/StopPoints";
import { getTrips } from "../views/content/map/component/organism/Trips";
import {
  currentDrawPath,
  setCurrentDrawPath,
} from "../views/content/path/component/drawPath.utils";
import {
  selectedPath,
  setSelectedPath,
} from "../views/content/path/component/organism/PathDetail";
import { SchoolUtils } from "./school.utils";

export namespace PathUtil {
  export function tripsWherePathIsUsed(pathId: number | undefined): TripType[] {
    return getTrips().filter((trip) => trip.path?.id == pathId);
  }

  export function haveReversedTrip(trip: TripType) {
    const tripsOfPath = tripsWherePathIsUsed(trip.path?.id).filter(
      (trip_) => trip_.id != trip.id
    );

    const currentDirection = TripDirectionEntity.FindDirectionById(
      trip.tripDirectionId
    ).type;

    const haveReversedTrip = tripsOfPath.some((trip_) => {
      const tripDirection = TripDirectionEntity.FindDirectionById(
        trip_.tripDirectionId
      ).type;
      if (tripDirection != currentDirection) return true;
      return false;
    });

    return haveReversedTrip;
  }

  export function getSchoolsInPath(path: PathType | undefined) {
    return path?.points
      .filter((point) => point.nature == NatureEnum.school)
      .map((school) => SchoolUtils.get(school.id));
  }

  export function getCountOfTripUsingPath(
    pathId: number,
    lineId: number
  ): number {
    const line = getLines().filter((line) => line.id == lineId)[0];
    return line.trips.filter((trip) => trip.path?.id == pathId).length;
  }

  export function getPathPoint(point: PathPointType) {
    if (point.nature == NatureEnum.stop)
      return getStops().filter((stop) => stop.id == point.id)[0];
    else return getSchools().filter((stop) => stop.id == point.id)[0];
  }

  export function getQuantityOfPoint(
    point: StopType | SchoolType,
    grades: number[]
  ) {
    let quantity = 0;
    point.associated.forEach((asso) => {
      if (grades.includes(asso.gradeId) && point.nature == NatureEnum.stop)
        quantity += asso.quantity;
    });
    return quantity;
  }

  export function isValidPath(path: PathType | undefined) {
    if (!(path && path?.points.length > 1)) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content:
          "Veuillez sélectionner au moins deux points pour créer un chemin.",
      });
      return false;
    } else return true;
  }

  export async function update(path: PathType) {
    enableSpinningWheel();
    const lineId = getSelectedLine()?.id as number;
    const updatedPath = await PathService.update(path, lineId);

    setLines((line) => {
      return [...line].map((line) => {
        if (line.id == lineId)
          line.paths = line.paths.map((path_) => {
            if (path_.id == path.id) path_ = updatedPath;
            return path_;
          });
        return line;
      });
    });

    if (currentDrawPath()?.id == updatedPath.id)
      setCurrentDrawPath(updatedPath);
    if (selectedPath()?.id == updatedPath.id) setSelectedPath(updatedPath);
    disableSpinningWheel();
  }
}
