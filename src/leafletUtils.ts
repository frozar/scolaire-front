import { linkMap } from "./views/content/graphicage/component/organism/Points";
import { getSchools } from "./views/content/graphicage/component/organism/SchoolPoints";
import { getStops } from "./views/content/graphicage/component/organism/StopPoints";

export function setStopPointsColor(leafletIds: number[], color: string) {
  getStops().map((stop) => {
    if (!leafletIds.includes(stop.leafletId)) {
      const circle = linkMap.get(stop.leafletId);
      circle?.setStyle({ fill: true, fillColor: color });
    }
  });
}

export function setSchoolPointsColor(leafletIds: number[], color: string) {
  getSchools().map((stop) => {
    if (!leafletIds.includes(stop.leafletId)) {
      const circle = linkMap.get(stop.leafletId);
      circle?.setStyle({ fill: true, fillColor: color });
    }
  });
}
