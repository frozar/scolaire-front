import { useStateAction } from "./StateAction";
import { linkMap } from "./views/content/map/component/organism/Points";
import { getSchools } from "./views/content/map/component/organism/SchoolPoints";
import { getStops } from "./views/content/map/component/organism/StopPoints";
import { COLOR_STOP_FOCUS } from "./views/content/map/constant";
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
  getSchools().map((stop) => {
    if (!leafletIds.includes(stop.leafletId)) {
      const circle = linkMap.get(stop.leafletId);
      circle?.setStyle({ fill: true, fillColor: color });
    }
  });
}

// ! Rename
// ! Déplacer ?
// export function changePointsColorAfterPointSelection(
//   point: SchoolType | StopType
// ) {}
