import { asyncAuthenticateWrap } from "../../layout/authentication";

const config = {
  host: import.meta.env.VITE_BACK_URL,
};

export async function fetchSchool(mapId: number) {
  const headers = await asyncAuthenticateWrap();

  try {
    const response = await fetch(
      config.host + `/map/${mapId}/dashboard/ramassage`,
      { headers }
    );

    const json = await response.json();
    return json;
  } catch (error) {
    // TODO push notification
    console.log(error);
    return false;
  }
}
