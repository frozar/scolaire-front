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

export function addBusLine(idsPoint: number[]) {
  return fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids_point: idsPoint }),
  });
}
