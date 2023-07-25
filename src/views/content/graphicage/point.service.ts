import { addNewUserInformation } from "../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../type";
import { asyncAuthenticateWrap } from "../../layout/authentication";

const config = {
  host: import.meta.env.VITE_BACK_URL,
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

export async function fetchSchool(mapId: number) {
  const headers = await asyncAuthenticateWrap();

  try {
    const response = await fetch(
      config.host + `/map/${mapId}/dashboard/etablissement`,
      { headers }
    );

    const json = await response.json();
    return json.content;
  } catch (error) {
    connexionError();
    return false;
  }
}

export async function fetchStop(mapId: number) {
  const headers = await asyncAuthenticateWrap();

  try {
    const response = await fetch(
      config.host + `/map/${mapId}/dashboard/ramassage`,
      { headers }
    );

    const json = await response.json();
    return json.content;
  } catch (error) {
    connexionError();
    return false;
  }
}

export async function fetchEleveVersEtablissement(mapId: number) {
  const headers = await asyncAuthenticateWrap();

  try {
    const response = await fetch(
      config.host + `/map/${mapId}/eleve_vers_etablissement`,
      { headers }
    );

    const json = await response.json();
    return json.content;
  } catch (error) {
    connexionError();
    return false;
  }
}
