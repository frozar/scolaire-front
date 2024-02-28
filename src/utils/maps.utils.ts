import { useStateGui } from "../StateGui";
import { MapType } from "../_entities/map.entity";
import { MapService } from "../_services/map.service";
import { setUserMaps } from "../_stores/map.store";
import { disableSpinningWheel, enableSpinningWheel } from "../signaux";

const [, { setActiveMapId }] = useStateGui();

export namespace MapsUtils {
  export function getSelectedMap(maps: MapType[]): MapType | null {
    let map = null;
    for (const _map of maps) {
      if (_map.isActive()) {
        map = _map;
      }
    }
    return map;
  }

  export function setActiveMap(mapId: number) {
    setUserMaps((prev) =>
      [...prev].map((map) => {
        map.setIsActive(map.id === mapId);
        return map;
      })
    );
    setActiveMapId(mapId);
  }

  export async function updateMap(map: Partial<MapType>) {
    const updatedMap = await MapService.update(map as MapType);
    enableSpinningWheel();
    setUserMaps((prev) =>
      [...prev].map((map_) => {
        if (map_.id == map.id) {
          map_ = {
            ...map_,
            ...updatedMap,
          };
        }
        return map_;
      })
    );
    disableSpinningWheel();
  }

  export async function createMap(map: Partial<MapType>) {
    const newMap: MapType = await MapService.create({
      name: map.name as string,
    });
    if (!newMap) return false;

    setUserMaps((prev) => [...prev, newMap]);
    MapsUtils.setActiveMap(newMap.id);
  }
}
