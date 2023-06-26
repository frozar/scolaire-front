import { createSignal } from "solid-js";
import { useStateGui } from "../../../StateGui";
import { UserMapType } from "../../../type";
import { authenticateWrap } from "../../layout/topNav/authentication";
import { closeCreateMapModal, closeDeleteMapModal } from "./Dashboard";

const [, { getActiveMapId }] = useStateGui();

export const [userMaps, setUserMaps] = createSignal<UserMapType[]>([]);

export function fetchUserMaps() {
  authenticateWrap((headers) => {
    fetch(import.meta.env.VITE_BACK_URL + "/maps", {
      method: "GET",
      headers,
    })
      .then(async (res) => {
        const data: {
          status: string;
          content: {
            id: number;
            name: string;
          }[];
        } = await res.json();

        const { content } = data;

        // TODO: check status

        const maps: UserMapType[] = content.map((userMap) => {
          const [isActive, setIsActive] = createSignal(false);
          const [isSelected, setIsSelected] = createSignal(false);

          const userMapId = userMap.id;
          if (getActiveMapId() === userMapId) {
            setIsActive(true);
          }

          return {
            ...userMap,
            isActive,
            isSelected,
            setIsSelected,
            setIsActive,
          } as UserMapType;
        });

        setUserMaps(maps);
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

export function createMap(mapName: string) {
  closeCreateMapModal();
  authenticateWrap((headers) => {
    fetch(import.meta.env.VITE_BACK_URL + "/map", {
      method: "POST",
      headers,
      body: JSON.stringify({ name: mapName }),
    })
      .then(() => {
        fetchUserMaps();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

export function deleteMap(mapId: number) {
  closeDeleteMapModal();
  authenticateWrap((headers) => {
    fetch(import.meta.env.VITE_BACK_URL + `/map/${mapId}`, {
      method: "DELETE",
      headers,
    })
      .then(() => {
        fetchUserMaps();
      })
      .catch((error) => {
        console.log(error);
      });
  });
}
