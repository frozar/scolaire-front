import { MapType } from "../_entities/map.entity";

export namespace MapsUtils {
  export function getSelectedMap(maps: MapType[]): MapType | null {
    let map = null;
    for (const _map of maps) {
      if (_map.isActive()) {
        map = _map;
      }
    }
    console.log(map);
    return map;
  }
}
