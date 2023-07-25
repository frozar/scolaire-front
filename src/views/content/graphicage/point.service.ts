import { addNewUserInformation } from "../../../signaux";
import {
  MessageLevelEnum,
  MessageTypeEnum,
} from "../../../type";
import { asyncAuthenticateWrap } from "../../layout/authentication";

const config = {
  host: import.meta.env.VITE_BACK_URL,
  xano: import.meta.env.VITE_XANO_URL,
};

const connexionError = () => {
  addNewUserInformation({
    displayed: true,
    level: MessageLevelEnum.error,
    type: MessageTypeEnum.global,
    content:
      "Désoler une erreur est survenue lors du chargement des données veuillez essayer ultérieument",
  });
};

const manageStatusCode = async (response: Response) => {
  if (response.status !== 200) {
    const json = await response.json();
    const message =
      json.detail ??
      "Désolé une erreur est survenue lors du chargement des données veuillez essayer ultérieument";

    addNewUserInformation({
      displayed: true,
      level: MessageLevelEnum.error,
      type: MessageTypeEnum.global,
      content: message,
    });

    return false;
  }

  return true;
};

export async function fetchSchool(mapId: number) {
  const headers = await asyncAuthenticateWrap();
  let response: Response;
  try {
    response = await fetch(
      config.host + `/map/${mapId}/dashboard/etablissement`,
      { headers }
    );
  } catch (error) {
    connexionError();
    return false;
  }

  if (!(await manageStatusCode(response))) return;
  const json = await response.json();
  return json.content;
}

export async function fetchEleveVersEtablissement(mapId: number) {
  const headers = await asyncAuthenticateWrap();
  let response: Response;

  try {
    response = await fetch(
      config.host + `/map/${mapId}/eleve_vers_etablissement`,
      { headers }
    );
  } catch (error) {
    connexionError();
    return false;
  }

  if (!manageStatusCode(response)) return;
  const json = await response.json();
  return json.content;
}

export async function fetchStop(mapId: number) {
  const headers = await asyncAuthenticateWrap();
  let response: Response;

  try {
    //TODO Xano url
    // response = await fetch(config.xano + `/map/${mapId}/stop`, {
    response = await fetch(config.host + `/map/${mapId}/dashboard/ramassage`, {
      headers,
    });
  } catch (error) {
    connexionError();
    return [];
  }

  if (!(await manageStatusCode(response))) return [];
  const json = await response.json();
  //TODO Format Data for XAno
  // return formatStops(json);
  return json.content;
}

// type PointStopDBType = {
//   id: number;
//   name: string;
//   location: {
//     data: {
//       lng: number;
//       lat: number;
//     };
//   };
//   schools: SchoolOfStopDBType[];
// };

// type SchoolOfStopDBType = {
//   school: {
//     id: number;
//     name: string;
//   };
//   quantity: number;
// };

// const formatStops = (stops: PointStopDBType[]): PointStopType[] => {
//   return stops.map((stop) => {
//     return {
//       id: stop.id,
//       lon: stop.location.data.lng,
//       lat: stop.location.data.lat,
//       name: stop.name,
//       schools: formatSchoolsOfStop(stop.schools),
//     };
//   });
// };

// function formatSchoolsOfStop(
//   schools: SchoolOfStopDBType[]
// ): SchoolOfStopType[] {
//   return schools.map((item) => {
//     return {
//       id: item.school.id,
//       name: item.school.name,
//       quantity: item.quantity,
//     };
//   });
// }
