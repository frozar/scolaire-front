export function deleteBusLine(idToRemove: number) {
  return fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: idToRemove,
    }),
  });
}

export function deleteRamassage(idToRemove: number) {
  return fetch(import.meta.env.VITE_BACK_URL + "/point_ramassage", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: idToRemove,
    }),
  });
}

export function clear() {
  return fetch(import.meta.env.VITE_BACK_URL + "/clear", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function addBusLine(idsPoint: number[]) {
  return fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids_point: idsPoint }),
  });
}
