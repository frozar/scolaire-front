import { getToken } from "./auth/auth";

export async function deleteBusLine(idToRemove: number) {
  return getToken()
    .then((token) => {
      return fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: idToRemove,
        }),
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function clear() {
  return getToken()
    .then((token) => {
      return fetch(import.meta.env.VITE_BACK_URL + "/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function addBusLine(idsPoint: number[]) {
  return getToken()
    .then((token) => {
      return fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids_point: idsPoint }),
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
