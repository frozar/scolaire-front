import { useStateAction } from "./StateAction";
import { PointType } from "./_entities/_utils.entity";
import { NatureEnum } from "./type";
import { getSelectedBusLine } from "./views/content/map/component/organism/BusLines";
import { linkMap } from "./views/content/map/component/organism/Points";
import { getSchools } from "./views/content/map/component/organism/SchoolPoints";
import { getStops } from "./views/content/map/component/organism/StopPoints";
import {
  COLOR_SCHOOL_FOCUS,
  COLOR_SCHOOL_LIGHT,
  COLOR_STOP_FOCUS,
  COLOR_STOP_LIGHT,
} from "./views/content/map/constant";
const [, { isInAddLineMode }] = useStateAction();

export function setStopPointsColor(leafletIds: number[], color: string) {
  if (isInAddLineMode()) return;
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
  if (isInAddLineMode()) return;
  getSchools().map((school) => {
    const circle = linkMap.get(school.leafletId);
    if (!leafletIds.includes(school.leafletId)) {
      circle?.setStyle({ fill: true, fillColor: color });
    } else {
      circle?.setStyle({ fill: true, fillColor: COLOR_SCHOOL_FOCUS });
    }
  });
}

export function updateOnMapPointColor(point?: PointType) {
  const ids: number[] = [];
  if (point) {
    ids.push(point.leafletId);
    const nature = point.nature;
    const points = nature == NatureEnum.school ? getStops() : getSchools();

    for (const associated of point.associated) {
      const leafletPoint = points.filter((item) => item.id == associated.id)[0];
      ids.push(leafletPoint.leafletId);
    }

    if (nature == NatureEnum.school) {
      const circle = linkMap.get(point.leafletId);
      circle?.setStyle({ fillColor: COLOR_SCHOOL_FOCUS });
    }
  } else {
    const selectedBusLine = getSelectedBusLine();
    if (!selectedBusLine) {
      return;
    }
    ids.push(...selectedBusLine.points.map((point) => point.leafletId));
  }

  setSchoolPointsColor(ids, COLOR_SCHOOL_LIGHT);
  setStopPointsColor(ids, COLOR_STOP_LIGHT);
}
