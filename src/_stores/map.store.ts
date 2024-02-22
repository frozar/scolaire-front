import { createSignal } from "solid-js";
import { useStateGui } from "../StateGui";
import { MapType } from "../_entities/map.entity";
import { MapService } from "../_services/map.service";
import {
  closeCreateMapModal,
  closeDeleteMapModal,
} from "../views/content/maps/Maps";

//TODO refacto
const [, { getActiveMapId, resetState }] = useStateGui();

export const [userMaps, setUserMaps] = createSignal<MapType[]>([]);

export namespace MapStore {
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
    const map: MapType = await MapService.create({ name: mapName });
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
