import { PointType } from "./_entities/_utils.entity";
import { getSchools } from "./_stores/school.store";
import { getStops } from "./_stores/stop.store";
import { NatureEnum } from "./type";
import { linkMap } from "./views/content/map/component/organism/Points";
import { selectedTrip } from "./views/content/map/component/organism/Trips";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_SCHOOL_LIGHT,
  COLOR_STOP_FOCUS,
  COLOR_STOP_LIGHT,
} from "./views/content/map/constant";

export function setStopPointsColor(leafletIds: number[], color: string) {
  getStops().map((stop) => {
    const circle = linkMap.get(stop.leafletId);
    if (!leafletIds.includes(stop.leafletId)) {
      circle?.setStyle({ fill: true, fillColor: color });
    } else {
      circle?.setStyle({ fill: true, fillColor: COLOR_STOP_FOCUS });
    }
  });
}
export function setSchoolPointsColor(leafletIds: number[], color: string) {
  getSchools().map((school) => {
    const circle = linkMap.get(school.leafletId);
    if (!leafletIds.includes(school.leafletId)) {
      circle?.setStyle({ fill: true, fillColor: color });
    } else {
      circle?.setStyle({ fill: true, fillColor: COLOR_SCHOOL_FOCUS });
    }
  });
}

export function updatePointColor(point?: PointType) {
  const ids: number[] = [];
  if (point) {
    ids.push(point.leafletId);
    const nature = point.nature;
    const points = nature == NatureEnum.school ? getStops() : getSchools();

    for (const associated of point.associated) {
      const leafletPoint = points.filter(
        (item) =>
          item.id ==
          (nature == NatureEnum.school
            ? associated.stopId
            : associated.schoolId)
      )[0];
      ids.push(leafletPoint.leafletId);
    }

    if (nature == NatureEnum.school) {
      const circle = linkMap.get(point.leafletId);
      circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
    }
  } else {
    const trip = selectedTrip();
    if (!trip) {
      return;
    }
    ids.push(...trip.tripPoints.map((point) => point.leafletId));
  }

  setSchoolPointsColor(ids, COLOR_SCHOOL_LIGHT);
  setStopPointsColor(ids, COLOR_STOP_LIGHT);
}
