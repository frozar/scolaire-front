import { authenticateWrap } from "./views/layout/authentication";

import { useStateGui } from "./StateGui";

const [, { getActiveMapId, getSelectedMenu }] = useStateGui();

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

export async function addBusLine(
  stops: { id_resource: number; nature: string }[]
) {
  return authenticateWrap((headers) => {
    return fetch(
      import.meta.env.VITE_BACK_URL + `/map/${getActiveMapId()}/bus_line`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ stops }),
      }
    );
  });
}

export async function uploadFile(formData: FormData) {
  let url = import.meta.env.VITE_BACK_URL + `/map/${getActiveMapId()}/import`;

  switch (getSelectedMenu()) {
    case "etablissements":
      url += "/etablissement";
      break;
    case "ramassages":
      url += "/ramassage";
      break;
  }

  return authenticateWrap((headers) => {
    return fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
  }, true);
}

export async function updateBusLine(selectedBusLineId: number, color: string) {
  return authenticateWrap((headers) => {
    const colorWk = color.length === 6 ? color : color.substring(1);

    return fetch(
      import.meta.env.VITE_BACK_URL +
        `/map/${getActiveMapId()}/bus_line/${selectedBusLineId}`,
      {
        headers,
        method: "PATCH",
        body: JSON.stringify({ color: colorWk }),
      }
    );
  });
}
