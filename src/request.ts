import { authenticateWrap } from "./views/layout/authentication";

import { useStateGui } from "./StateGui";

const [, { getActiveMapId }] = useStateGui();

export async function deleteBusLine(idToRemove: number) {
  return authenticateWrap((headers) => {
    return fetch(
      import.meta.env.VITE_BACK_URL +
        `/map/${getActiveMapId()}/bus_line/${idToRemove}`,
      {
        method: "DELETE",
        headers,
      }
    );
  });
}

export async function clear() {
  return authenticateWrap((headers) => {
    return fetch(import.meta.env.VITE_BACK_URL + "/clear", {
      method: "DELETE",
      headers,
    });
  });
}

export async function addBusLine(idsPoint: number[]) {
  return authenticateWrap((headers) => {
    return fetch(
      import.meta.env.VITE_BACK_URL + `/map/${getActiveMapId()}/bus_line`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ ids_point: idsPoint }),
      }
    );
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

export async function updateBusLine(selectedBusLineId: number, color: string) {
  return authenticateWrap((headers) => {
    return fetch(
      import.meta.env.VITE_BACK_URL +
        `/map/${getActiveMapId()}/bus_line/${selectedBusLineId}`,
      {
        headers,
        method: "PATCH",
        body: JSON.stringify({ color: color }),
      }
    );
  });
}
