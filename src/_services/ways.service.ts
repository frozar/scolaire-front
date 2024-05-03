import { useStateGui } from "../StateGui";
import { WayType, wayEntity } from "../_entities/way.entity";
import { userMaps } from "../_stores/map.store";
import { WayStore, getWays } from "../_stores/way.store";
import { MapsUtils } from "../utils/maps.utils";
import { ServiceUtils } from "./_utils.service";
import { DBway } from "./osrm.service";

const host = import.meta.env.VITE_BACK_URL;
const [, { getActiveMapId }] = useStateGui();
export namespace WayService {
  //TODO refacto
  export async function getAll(): Promise<WayType[]> {
    if (WayStore.isSetted()) {
      return getWays();
    }

    const curMap = MapsUtils.getSelectedMap(userMaps());
    if (curMap) {
      const res: DBway[] = await ServiceUtils.generic(
        host +
          "/osrm/ways?map_id=" +
          getActiveMapId() +
          "&min_X=" +
          curMap.bounding_box.min_X +
          "&min_Y=" +
          curMap.bounding_box.min_Y +
          "&max_X=" +
          curMap.bounding_box.max_X +
          "&max_Y=" +
          curMap.bounding_box.max_Y +
          "&srid=" +
          curMap.bounding_box.srid,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.map((dbWay) => wayEntity.build(dbWay));
    }
    return [];
  }
}
