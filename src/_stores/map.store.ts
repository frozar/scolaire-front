import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { BoundingBox, MapType } from "../_entities/map.entity";
import { MapService } from "../_services/map.service";
import {
  closeCreateMapModal,
  closeDeleteMapModal,
} from "../views/content/maps/Maps";

//TODO refacto
const [, { getActiveMapId, resetState }] = useStateGui();
export const defaultBoundingBox: BoundingBox = {
  min_X: 55.499153,
  min_Y: -20.986765,
  max_X: 55.595627,
  max_Y: -20.877418,
  srid: 4326,
};
export const [userMaps, setUserMaps] = createSignal<MapType[]>([]);

export namespace MapStore {
  export function getById(id: number | null) {
    let output = null;
    if (id != null && userMaps().length > 0) {
      for (const map of userMaps()) {
        if (map.id == id) {
          output = map;
          break;
        }
      }
    }
    return output;
  }

  export async function fetchUserMaps() {
    const maps: MapType[] = await MapService.getAll();

    if (
      maps.length === 0 ||
      !maps.flatMap((map) => map.id).includes(getActiveMapId() ?? -1)
    ) {
      resetState();
    }

    setUserMaps(maps);
  }

  export async function createMap(mapName: string) {
    closeCreateMapModal();
    const map: MapType = await MapService.create({
      name: mapName,
    });
    setUserMaps([...userMaps(), map]);
  }

  export async function deleteMap(mapId: number) {
    closeDeleteMapModal();
    const isDeleted: boolean = await MapService.delete(mapId);

    if (isDeleted) {
      setUserMaps(userMaps().filter((map) => map.id != mapId));
    }
  }
}
