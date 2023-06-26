import { authenticateWrap } from "./views/layout/topMenu/authentication";

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
    return fetch(import.meta.env.VITE_BACK_URL + "/clear", {
      method: "DELETE",
      headers,
    });
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

export async function uploadLine(formData: FormData) {
  return authenticateWrap((headers) => {
    return fetch(import.meta.env.VITE_BACK_URL + "/uploadfile", {
      method: "POST",
      headers,
      body: formData,
    });
  }, true);
}
