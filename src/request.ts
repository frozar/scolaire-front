import { authenticateWrap } from "./views/layout/authentication";

import { useStateGui } from "./StateGui";

const [, { getActiveMapId }] = useStateGui();

export async function deleteBusLine(idToRemove: number) {
  return authenticateWrap((headers) => {
    return fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
      method: "DELETE",
      headers,
      body: JSON.stringify({
        id: idToRemove,
      }),
    });
  });
}

export async function clear() {
  return authenticateWrap((headers) => {
    return fetch(
      import.meta.env.VITE_BACK_URL + `/map/${getActiveMapId()}/clear`,
      {
        method: "DELETE",
        headers,
      }
    );
  });
}

export async function addBusLine(idsPoint: number[]) {
  return authenticateWrap((headers) => {
    return fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
      method: "POST",
      headers,
      body: JSON.stringify({ ids_point: idsPoint }),
    });
  });
}

export async function uploadFile(formData: FormData) {
  return authenticateWrap((headers) => {
    return fetch(
      import.meta.env.VITE_BACK_URL + `/map/${getActiveMapId()}/uploadfile`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );
  }, true);
}
